const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true
});


const articlesSchema ={
  title : String,
  Content: String
};

const Article = mongoose.model("Article", articlesSchema);


//single route

app.route("/articles")

.get(function(req,res){
  Article.find(function(err,foundArticles){
    res.send(foundArticles);
  })
})

.post(function(req,res){
  const newArticle = new Article({
   title: req.body.title,
   Content: req.body.Content
  });
  newArticle.save(function(err){
   if(!err){
     res.send("successfully added a new article.");
   } else{
     res.send(err);
   }
  });
 })
 
 .delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("succesfully deleted all articles.");
    }else{
      res.send(err);
    }
  });
})

// new get req using app route//chaining mehtod

app.route("/articles/:articleTitle")
// req.params.articleTitle = " jquery"
.get(function(req,res){
  Article.findOne({title: req.params.articleTitle},function(err,foundArticles){
  if(foundArticles){
    res.send(foundArticles);
  }else{
    res.send("no articles matching that tile was found.");
  }
 })
})

.put(function(req,res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {title:req.body.title, Content: req.body.Content},

    function(err){
      if(!err){
        res.send("successfully updated article.");
      }
    }
  )
})


.patch(function(req,res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("successfully updated article.");
      }else{
        res.send(err);
      }
    }
  )
})

.delete(function(req,res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(!err){
        res.send("successfully deleted article.");
      }else{
        res.send(err);
      }
    }
  )
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});