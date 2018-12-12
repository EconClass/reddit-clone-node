const Post = require("../models/post.js");
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
chai.use(chaiHttp);

describe( "Posts", () => {
    it("Should create with valid attributes at POST /posts", done =>{
        Post.find(function(err, posts) {
            var postCount = posts.count;
          
            var post = { title: "post title", url: "https://www.google.com", summary: "post summary" };
          
            chai
              .request("localhost:3000")
              .post("/posts")
              .send(post)
              .then(res => {
                Post.find(function(err, posts) {
                  posts.should.be.equal(posts.length - 1);
                  res.should.have.status(200);
                  return done();
                });
              })
              .catch(err => {
                return done(err);
              });
          });
        
          var post = { title: "post title", url: "https://www.google.com", summary: "post summary" };
        // Delete
        Post.findOneAndRemove( post, function() {
            Post.find(function(err, posts) {
              var postCount = posts.count;
              chai
                .request("localhost:3000")
                .post("/posts")
                .send(post)
                .then(res => {
                  Post.find(function(err, posts) {
                    postCount.should.be.equal(posts.length + 1);
                    res.should.have.status(200);
                    return done();
                  });
                })
                .catch(err => {
                  return done(err);
                });
            });
          });
    });
});