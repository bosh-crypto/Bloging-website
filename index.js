const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const port = 3000
const dbURI = require('./dbfile');
const { result } = require('lodash');
const { render } = require('ejs');
const app = express()

const dbURI = "mongodb+srv://gatikwrking:temp123@testcluster.ct1zp.mongodb.net/nodetuts?retryWrites=true&w=majority&appName=testcluster"

mongoose.connect(dbURI)
    .then((result)=>console.log("connected to BD") );
    
app.set("view engine" , "ejs");
//app.use(express.static("public"))
app.use('/public', express.static('public'));
app.use(express.urlencoded());
app.use(morgan('dev'))



app.get('/', (req, res) => {  
    res.redirect("/blogs");
})


app.get('/about', (req, res) => {
    res.render('aboutus' , {title: "About" })
})

app.get('/about-us', (req, res) => {
    res.redirect("/about" )
})

app.get('/blogs', (req,res)=>{
    Blog.find().sort({createdAt:-1})
        .then((result)=>{
            res.render('index',{title: "All Blogs" , blog: result})
        })
        .catch((err)=>{
            console.log(err);
        })
});

app.post('/blogs', (req , res) => {
    const blog = new Blog(req.body);
    console.log(req.body)

    blog.save()
        .then((result) => {
           res.redirect('/blogs');
        })
        .catch((err) =>{
            console.log(err);
        })
});


app.get('/blogs/:id', (req , res) => {
    const id = req.params.id;
    Blog.findById(id)
        .then(result => {
            res.render("details" , { blog: result , title: "blog Detailes"})
        })
        .catch(err =>{
            console.log(err)
        });
})

app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;
    
    Blog.findByIdAndDelete(id)
      .then(result => {
        res.json({ redirect: '/blogs' });
      })
      .catch(err => {
        console.log(err);
      });
});

app.get('/Create', (req, res) => {
    res.render('Create' , {title: "Create a new page" })
})
  

app.get('/404', (req, res) => {
    res.render("404" , {title: "OOPs" })
})

app.use((req,res) => {
    res.status(404).render("404", {title:"404"})
})

app.listen(port, () => 
    console.log(`Example app listening on port ${port}!`))