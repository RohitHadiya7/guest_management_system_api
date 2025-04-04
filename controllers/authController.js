import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
      name: name,
      email: email,
      password: hashedPassword,
    })

    await user.save()
    res.status(201).send('User registered successfully')
  } catch (error) {
    console.error("Error during registration:", error)
    res.status(500).send('Error registering user')
  }
}

const loginUser = async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return res.status(400).send('Cannot find user')
  }

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const accessToken = jwt.sign(
        { _id: user._id, email: user.email, name: user.name },
        process.env.JWT_SECRET
      )
      res.json({ accessToken: accessToken, userId: user._id, name: user.name })
    } else {
      res.status(401).send('Incorrect password')
    }
  } catch {
    res.status(500).send()
  }
}

export { registerUser, loginUser }