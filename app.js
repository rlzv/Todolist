const express = require('express');
const bodyParser = require('body-parser');
// conn to the db
const mongoose = require('mongoose');
// require the module date.js 
const date = require(__dirname + '/date.js');
const _ = require('lodash');

const app = express();

// we grab the values of newItem
// we use const for arrays because we are not reasigning values
// because we won't assign the values to an another array or object


// use ejs as it's view enginge
app.set('view enginge', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

const day = date.getDate();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/todolistDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


// adding schemas
const itemsSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to the todolist!"
});

const item2 = new Item({
    name: "Press + for adding a new item."
});

const item3 = new Item({
    name: "<-- Press here to delete an item."
});

const defaultItems = [item1, item2, item3];


const routeSchema = {
    name: String,
    // array of documents associated
    items: [itemsSchema]
}


// model
const Route = mongoose.model("Route", routeSchema);


app.get("/", (req, res) => {



    // send all {} the items to the database
    Item.find({}).then(
        (foundItems) => {
            if (foundItems.length === 0) {
                //insert array defaultItems using async func
                Item.insertMany(defaultItems).then(
                    (defaultItems) => {
                        console.log("Awesome, items added to the DB!");
                    }
                ).catch(
                    (err) => {
                        console.log(err);
                    }
                );
                // redirect again to this get route to render the else block too!!!
                // because we have items to the collection
                res.redirect("/");
            } else {
                // render day as my listTitle, render items as my newArrayListItems
                res.render("list.ejs", { listTitle: day, newArrayListItems: foundItems });
            }
        }
    ).catch(
        (err) => {
            console.log(err);
        }
    );
});


app.get("/:customRoute", (req, res) => {
    // using lodash so the user can enter what he want to do in either lower or upper case
    const customRouteName = _.capitalize(req.params.customRoute);

    Route.findOne({ name: customRouteName }).then(
        (foundRoute) => {
            if (!foundRoute) {
                // document create new route
                const route = new Route({
                    //whatever user types
                    name: customRouteName,
                    items: defaultItems
                });
                route.save();
                // for the data to be shown as a title
                res.redirect("/" + customRouteName);
                console.log(`New route saved: ${route.name}`);
            } else {
                res.render("list.ejs", { listTitle: foundRoute.name, newArrayListItems: foundRoute.items });
            }
        }
    ).catch(
        (err) => {
            console.log(err);
        }
    );

});


app.post("/", (req, res) => {

    // we grab the item from the post req
    const itemInputName = req.body.newItem;
    const listInputName = req.body.list;

    const item = new Item({
        // get the name from list.ejs
        name: itemInputName
    });

    if (itemInputName === day) {
        // save the item into the collection of items
        item.save();

        // to enter to the get route to find all the items that have been posted inside the collection and
        // so the page refreshes and the data is displayed on whatever route we are
        res.redirect("/" + listInputName);
    } else {
        Route.findOne({ name: listInputName }).then(
            (foundRoute) => {
                // push new items based on what user typed
                foundRoute.items.push(item);
                foundRoute.save();
                // redirect the user to the route that has been
                // so the form can make a post req on the dynamic pages
                // so we can save items on the todo on whatever page we want
                res.redirect("/" + listInputName);
            }
        ).catch(
            (err) => {
                console.log(err);
            }
        );
    }

});


app.post("/delete", (req, res) => {
    const checkDelItemId = req.body.checked;
    const delListName = req.body.delListName;

    if (delListName === day) {
        Item.findByIdAndRemove(checkDelItemId).then(
            () => {
                console.log("Item deleted!");
                res.redirect("/");
            }
        ).catch(
            (err) => {
                console.log(err);
            }
        );
        // else, the delete comes from custom list
    } else {
        //find the item inside items: [itemsSchema], then remove it
        // we find the name of the doc, update where we pull items array,
        // that has the ID that coresponds to what user checked(checkDelItemId)
        Route.findOneAndUpdate({ name: delListName }, { $pull: { items: { _id: checkDelItemId } } }).then(
            (foundList) => {
                res.redirect("/" + delListName);
            }
        ).catch(
            (err) => {
                console.log(err);
            }
        )
    }


});


app.get("/about", (req, res) => {
    res.render("about.ejs");
});


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});