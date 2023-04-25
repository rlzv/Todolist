# Todolist

To make the code runnable you need to install the npm packages (npm i express, ejs, body-parser) and run the app.js in terminal using nodemon app.js.


This project is made for practicing ejs templating and to make dynamic html pages. It's a to do list project where you can put tasks and the date it's beeing displayed as an h1 using the function toLocaleDateString. We have a separate file/module for the date and it's beeing required in the app.js. Inside the /views folder we have the templates for the data that's beeing displayed on the web app where we have an home file list.ejs that displays the items on the home page and for the creation of new elements as new task, I used a for loop to iterate over an array(newArrayListItems) where the new elements get's pushed into another array(items) so the elements can be displayed on the page. If we add to the route http://localhost:3000/ another route e.g /about we are reddirected to another page with another text that's beeing displayed for the about section. We can also acces the route /work where we get into a new to do list for working area.


Inside the app.js we set the view engine for ejs, we give acces to the .css that's inside the /public folder using express.static method. We get the date from the module date.js and we render the page list.ejs and we post the data that's beeing displayed item by item(task by task). We can create as many pages we like and we can integrate them into our app using app.get to that specific route(it's not hard to add new pages because I templated the header and the footer file and for new pages we need only to require them and to add the text desired).
