require("dotenv").config();
// IMPORTING PORT FROM .env
const { PORT = 4000, MONGODB_URL} = process.env;

// IMPORTING EXPRESS
const express = require("express");
const app = express();

// MIDDLEWARE
const cors = require("cors");
app.use(cors());
const morgan = require("morgan");
app.use(morgan("dev"));
app.use(express.json());

//DATABASE CONNECTION  
const mongoose = require("mongoose");
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

//MIDDLEWARE
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// connection event
mongoose.connection
.on("open", () => console.log("You're connected to mongoose"))
.on("close", () => console.log("You're disconnected from mongoose"))
.on("error", (error) => console.log(error))
// model
const CheeseSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String
});

const Cheese = mongoose.model("Cheese", CheeseSchema);

// ROUTES
app.get("/", (req, res) => {
    res.send("Cheese App")
});
//index route
app.get("/cheese", async (req, res) => {
    try {
        res.json(await Cheese.find({}));
    } catch (error){
        res.status(400).json(error);
    }
});
// create
app.post("/cheese", async (req, res) => {
    try {
        res.json(await Cheese.create(req.body));
    } catch (error) {
        res.status(400).json(error);
    }
});
app.put("/cheese/:id", async (req,res) => {
    try {
        res.json(
            await Cheese.findByIdAndUpdate(req.params.id, req.body, { new: true })
        );
    } catch (error) {
        res.status(400).json(error);
    }
});
// delete
app.delete("/cheese/:id", async (req, res) => {
    try {
        res.json(await Cheese.findByIdAndRemove(req.params.id));
    } catch (error){
        res.status(400).json(error);
    }
});


// LISTENER
app.listen(PORT, () => console.log(`listening on ${PORT}`));