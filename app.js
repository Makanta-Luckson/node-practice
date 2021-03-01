const express = require('express');
const mongoose = require('mongoose');
const Blog = require('./modules/mongo.js');
const app = express();
 
const DBURL = 'mongodb://Makanta:password71@cluster0-shard-00-00.ja3ps.mongodb.net:27017,cluster0-shard-00-01.ja3ps.mongodb.net:27017,cluster0-shard-00-02.ja3ps.mongodb.net:27017/Node-Practice?ssl=true&replicaSet=atlas-4moo8m-shard-0&authSource=admin&retryWrites=true&w=majority'
mongoose.connect(DBURL, {useNewUrlParser : true, useUnifiedTopology : true})
.then((result)=>{
    app.listen(3000, ()=>{
        console.log('listening on port 3000..............');
    })
})
.catch((err)=>{
    console.log(err);
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended : true}));

app.get('/', (req, res)=>{
res.redirect('/blogs')
});

app.get('/blogs', (req, res)=>{
    Blog.find().sort({createdAt : -1})
    .then((result)=>{
        res.render('blogs', {title : 'all blogs', blogs : result});
    })
    .catch((err)=>{
        console.log(err);
    });
});

app.post('/blogs', (req, res)=>{
  const blog = new Blog(req.body);
  blog.save()
  .then((result)=>{
        res.redirect('/blogs');
  })
  .catch((err)=>{
        console.log(err);
  });
});

app.get('/blogs/:id', (req, res)=>{
    const id = req.params.id;
    Blog.findById(id)
    .then((result)=>{
        res.render('details', {title : 'details page', Details : result});
    })
    .catch((err)=>{
        console.log(err)
    })
})

app.delete('/blogs/:id', (req, res)=>{
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
    .then((result)=>{
         res.json({ redirect : '/blogs'});
    })
    .catch((err)=>{
        console.log(err);
    })
});


app.get('/about', (req, res)=>{
    res.render('about',{title : 'about our blogs'});
});

app.get('/create', (req, res)=>{
    res.render('create', {title : 'New Blog'});
})


app.use((req, res)=>{
    res.render('404', {title : 'page not found'});
});

