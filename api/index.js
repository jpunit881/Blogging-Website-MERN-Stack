require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
app.use(cors({origin: 'http://localhost:3000'}));
const mongoose = require('mongoose');
const path = require("path");
const fs = require("fs");

const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");


app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/images", express.static(path.join(__dirname, "images")));


const multer = require('multer');



main().catch(err => console.log(err));

async function main() {
    // await mongoose.connect('mongodb://127.0.0.1:27017/blogs');
    // await mongoose.connect('mongodb+srv://punitjain:avUCCXg2H5qE8LvY@cluster0.qhwwlxy.mongodb.net/blog?retryWrites=true&w=majority');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('DATABASE CONNECTED FROM CLOUD ...!')

    const storage = multer.diskStorage({
        destination:(req,file,cb) => {
          cb(null,'images')
        },
        filename:(req,file,cb) => {
          console.log(file);
            cb(null,req.body.name);
        },
    })
    const upload = multer({storage:storage});
    app.post("/api/upload", upload.single("file"),(req,res) => {
        res.status(200).json("File has been uploaded")
    });

    app.get("/api/images/:filename", (req, res) => {
      const filename = req.params.filename;
      const imagePath = path.join(__dirname, "..", "images", filename); // Make sure to import the 'path' module
    
      // res.sendFile(imagePath);
      if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
      } else {
        res.status(404).send("Image not found");
      }
    });
}



//bodyParser
app.use(cors());
app.use(express.json());
app.use(morgan('default'))
app.use(express.static(process.env.PUBLIC_DIR));
// server.use('/blogs', blogRouter.router);



app.listen(process.env.PORT, () => {
    console.log('SERVER STARTED ...!')
});


/*
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(morgan('default'));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('DATABASE CONNECTED FROM CLOUD ...!');
    app.listen(process.env.PORT, () => {
      console.log('SERVER STARTED ...!');
    });
  })
  .catch(err => console.log(err));

// Routes
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);

// Remove the multer configuration from here

// Add your other middleware and routes as needed
*/