(async () => {
  try {
    const base = 'http://localhost:8000';

    // 1) Signup
    const unique = Date.now() % 10000;
    let resp = await fetch(base + '/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: `autotest_${unique}`, email: `autotest_${unique}@example.com`, password: 'Testpass123' }),
    });
    const body = await resp.text();
    console.log('SIGNUP status', resp.status);
    console.log('SIGNUP headers', resp.headers.get('set-cookie'));
    try { console.log('SIGNUP body json:', JSON.parse(body)); } catch(e) { console.log('SIGNUP body text:', body); }

    // try to extract cookie header manually from raw headers is not available in node fetch easily
    // but in dev our signup returns refreshToken in body; attempt parse
    let signupJson;
    try { signupJson = JSON.parse(body); } catch(e) { signupJson = null; }

    const refreshTokenFromBody = signupJson?.refreshToken || null;
    const accessTokenFromBody = signupJson?.accessToken || null;

    // 2) Call refresh using body refresh token
    if (!refreshTokenFromBody) {
      console.log('No refreshToken returned in signup body; skipping body-based refresh test.');
    } else {
      const r = await fetch(base + '/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: refreshTokenFromBody }),
      });
      const rb = await r.json().catch(() => null);
      console.log('REFRESH (body) status', r.status, 'body:', rb);
    }

    // 3) Create a post (no auth required)
    const createRes = await fetch(base + '/api/post/create-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'autotest', userId: 'autouser', postType: 'story', title: 'Test post', content: 'This is a test post' }),
    });
    const createJson = await createRes.json().catch(() => null);
    console.log('CREATE POST status', createRes.status, 'body:', createJson);
    const postId = createJson?.post?._id || createJson?.post?.id;

    if (!postId) {
      console.log('No post id returned; cannot test like endpoint.');
      return;
    }

    console.log('Created postId:', postId);

    // 4) Attempt like with invalid token (simulate expired)
    const badLike = await fetch(base + `/api/like/${postId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer invalidtoken' },
    });
    console.log('LIKE with invalid token status', badLike.status);
    const badLikeBody = await badLike.text();
    console.log('LIKE invalid body:', badLikeBody);

    // 5) Refresh using body token we received earlier and then like with new token
    if (!refreshTokenFromBody) {
      console.log('No refresh token available to test refresh+like flow.');
      return;
    }
    const refreshResp = await fetch(base + '/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: refreshTokenFromBody }),
    });
    const refreshJson = await refreshResp.json().catch(() => null);
    console.log('REFRESH status', refreshResp.status, 'body', refreshJson);
    const newAccess = refreshJson?.accessToken;
    if (!newAccess) {
      console.log('Refresh did not return accessToken; cannot proceed to like with new token.');
      return;
    }

    // 6) Like with new token
    const likeResp = await fetch(base + `/api/like/${postId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${newAccess}` },
    });
    const likeJson = await likeResp.json().catch(() => null);
    console.log('LIKE with refreshed token status', likeResp.status, 'body', likeJson);

  } catch (err) {
    console.error('Error running API test:', err);
  }
})();
