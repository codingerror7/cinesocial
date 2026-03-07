const express = require("express");
const app = express();
const PORT = 8000;
app.get("/",(req,res)=>{
    res.send("Cinesocial...");
});
app.listen(PORT,()=>{
    console.log(`Listening at ${PORT}....`);
})