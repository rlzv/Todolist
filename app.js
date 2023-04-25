const express = require('express');
const bodyParser = require('body-parser');
// require the module date.js 
const date = require(__dirname + '/date.js');

const app = express();

// we grab the values of newItem
// we use const for arrays because we are not reasigning values
// because we won't assign the values to an another array or object

const items = ["Take Task", "Resolve Task", "Announce Task Resolved"];
const workItems = [];

// use ejs as it's view enginge
app.set('view enginge', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));


app.get("/", (req, res) => {

    const day = date.getDate();

    // render day as my listTitle, render items as my newArrayListItems
    res.render("list.ejs", { listTitle: day, newArrayListItems: items });
});

app.post("/", (req, res) => {

    // we grab the item from the post req
    const item = req.body.newItem;

    // if the req came from 'work' list
    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work");
        // else we're going to oush it to our normal items array    
    } else {
        // everytime we get a post req we append "item" to our array "items"
        // when we pass it over to render our list view, we're going to pass over our entire array
        items.push(item);

        // when a post request is triggered on our home route,
        // we'll save the value of newItem in that text box to a variable called "item" and it will redirect to the home route
        // which gets us to the app.get("/")... and it will res.render the list template
        res.redirect("/");
    }


});

app.get("/work", (req, res) => {
    res.render("list.ejs", { listTitle: "Work List", newArrayListItems: workItems });
});

app.get("/about", (req, res) => {
    res.render("about.ejs");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});