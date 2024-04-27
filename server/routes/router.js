const express = require("express");
const router = new express.Router();
const userdb = require("../models/userSchema");
var bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");
//new add
const employees = require("../models/employeeSchema");

// for user signup

router.post("/signup", async (req, res) => {
  const { fname, email, password, cpassword } = req.body;

  if (!fname || !email || !password || !cpassword) {
    res.status(422).json({ error: "fill all the details" });
  }

  try {
    const preuser = await userdb.findOne({ email: email });

    if (preuser) {
      res.status(422).json({ error: "This Email is Already Exist" });
    } else if (password !== cpassword) {
      res
        .status(422)
        .json({ error: "Password and Confirm Password Not Match" });
    } else {
      const finalUser = new userdb({
        fname,
        email,
        password,
        cpassword,
      });

      // here password hasing

      const storeData = await finalUser.save();

      // console.log(storeData);
      res.status(201).json({ status: 201, storeData });
    }
  } catch (error) {
    res.status(422).json(error);
    console.log("catch block error");
  }
});

// user Login

router.post("/login", async (req, res) => {
  // console.log(req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    res.status(422).json({ error: "fill all the details" });
  }

  try {
    const userValid = await userdb.findOne({ email: email });

    if (userValid) {
      const isMatch = await bcrypt.compare(password, userValid.password);

      if (!isMatch) {
        res.status(422).json({ error: "invalid details" });
      } else {
        // token generate
        const token = await userValid.generateAuthtoken();

        // cookiegenerate
        res.cookie("usercookie", token, {
          expires: new Date(Date.now() + 9000000),
          httpOnly: true,
        });

        const result = {
          userValid,
          token,
        };
        res.status(201).json({ status: 201, result });
      }
    }
  } catch (error) {
    res.status(401).json(error);
    console.log("catch block");
  }
});

// user valid

router.get("/validuser", authenticate, async (req, res) => {
  try {
    const ValidUserOne = await userdb.findOne({ _id: req.userId });
    res.status(201).json({ status: 201, ValidUserOne });
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
});

// user logout

router.get("/logout", authenticate, async (req, res) => {
  try {
    req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
      return curelem.token !== req.token;
    });

    res.clearCookie("usercookie", { path: "/" });

    req.rootUser.save();

    res.status(201).json({ status: 201 });
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
});

//register user
router.post("/register", async (req, res) => {
  // console.log(req.body);
  // const {name} = req.body.name;
  const { name, email, age, mobile, work, add, desc } = req.body; //variable defined

  if (!name || !email || !age || !mobile || !work || !add || !desc) {
    res.status(422).json("plz fill the data");
  }

  try {
    const preuser = await employees.findOne({ email: email });
    console.log(preuser);

    if (preuser) {
      res.status(422).json("this  employee  is already present");
    } else {
      const adduser = new employees({
        name,
        email,
        age,
        mobile,
        work,
        add,
        desc,
      });

      // await adduser.save();
      // res.status(201).json(adduser);
      // console.log(adduser);

      const savedUser = await adduser.save();
      res.status(201).json(savedUser);
      console.log(savedUser);
    }
  } catch (error) {
    res.status(422).json(error);
  }
});

//get userdata
router.get("/getdata", async (req, res) => {
  try {
    const userdata = await employees.find();
    res.status(201).json(userdata);
    console.log(userdata);
  } catch (error) {
    res.status(422).json(error);
  }
});

// get individual user
router.get("/getuser/:id", async (req, res) => {
  try {
    console.log(req.params);
    const { id } = req.params;

    const userindividual = await employees.findById({ _id: id });
    console.log(userindividual);
    res.status(201).json(userindividual);
  } catch (error) {
    res.status(422).jsom(error);
  }
});

// update  user data
router.put("/updateuser/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updateduser = await employees.findByIdAndUpdate(id, req.body, {
      new: true,
      //jo bhi update karenge wo updated value milegi by new:true)
    });
    if (!updateduser) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(updateduser);
    res.status(201).json(updateduser);
  } catch (error) {
    res.status(422).json(error);
  }
});

//delete user
router.delete("/deleteuser/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleteuser = await employees.findByIdAndDelete({ _id: id });
    if (!deleteuser) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(deleteuser);
    res.status(201).json(deleteuser);
  } catch (error) {
    res.status(422).json(error);
  }
});

module.exports = router;

// 2 way connection
// 12345 ---> e#@$hagsjd
// e#@$hagsjd -->  12345

// hashing compare
// 1 way connection
// 1234 ->> e#@$hagsjd
// 1234->> (e#@$hagsjd,e#@$hagsjd)=> true
