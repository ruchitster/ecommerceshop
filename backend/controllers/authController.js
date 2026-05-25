import bcrypt from 'bcryptjs'

import jwt from 'jsonwebtoken'

import User from '../models/User.js'


// REGISTER

export const register =
  async (req, res) => {

    try {

      const {
        name,
        email,
        password,
      } = req.body

      const userExists =
        await User.findOne({
          email,
        })

      if (userExists) {

        return res.status(400).json({
          message:
            'User already exists',
        })
      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        )

      await User.create({

        name,
        email,

        password:
          hashedPassword,

      })

      res.status(201).json({
        message:
          'User Registered',
      })

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      })
    }
  }


// USER LOGIN

export const login =
  async (req, res) => {

    try {

      const {
        email,
        password,
      } = req.body

      const user =
        await User.findOne({
          email,
        })

      if (!user) {

        return res.status(400).json({
          message:
            'Invalid Credentials',
        })
      }

      // BLOCK CHECK
      if (user.isBlocked) {

        return res.status(403).json({
          message:
            'Account Blocked',
        })
      }

      const isMatch =
        await bcrypt.compare(
          password,
          user.password
        )

      if (!isMatch) {

        return res.status(400).json({
          message:
            'Invalid Credentials',
        })
      }

      const token =
        jwt.sign(

          {
            id: user._id,
            role: user.role,
          },

          process.env.JWT_SECRET,

          {
            expiresIn: '7d',
          }
        )

      res.json({

        token,

        user: {

          _id:
            user._id,

          name:
            user.name,

          email:
            user.email,

          role:
            user.role,

          isBlocked:
            user.isBlocked,

        },

      })

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      })
    }
  }


// ADMIN LOGIN

export const adminLogin =
  async (req, res) => {

    try {

      const {
        email,
        password,
      } = req.body

      const user =
        await User.findOne({
          email,
        })

      if (!user) {

        return res.status(400).json({
          message:
            'Invalid Credentials',
        })
      }

      // ADMIN CHECK
      if (
        user.role !== 'admin'
      ) {

        return res.status(403).json({
          message:
            'Access Denied',
        })
      }

      // BLOCK CHECK
      if (user.isBlocked) {

        return res.status(403).json({
          message:
            'Account Blocked',
        })
      }

      const isMatch =
        await bcrypt.compare(
          password,
          user.password
        )

      if (!isMatch) {

        return res.status(400).json({
          message:
            'Invalid Credentials',
        })
      }

      const token =
        jwt.sign(

          {
            id: user._id,
            role: user.role,
          },

          process.env.JWT_SECRET,

          {
            expiresIn: '7d',
          }
        )

      res.json({

        token,

        user: {

          _id:
            user._id,

          name:
            user.name,

          email:
            user.email,

          role:
            user.role,

          isBlocked:
            user.isBlocked,

        },

      })

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      })
    }
  }


// GET ALL USERS

export const getUsers =
  async (req, res) => {

    try {

      const users =
        await User.find()
          .select('-password')
          .sort({
            createdAt: -1,
          })

      res.json(users)

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      })
    }
  }


// DELETE USER

export const deleteUser =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.params.id
        )

      if (!user) {

        return res.status(404).json({
          message:
            'User not found',
        })
      }

      // PREVENT ADMIN DELETE
      if (
        user.role === 'admin'
      ) {

        return res.status(400).json({
          message:
            'Admin cannot be deleted',
        })
      }

      await User.findByIdAndDelete(
        req.params.id
      )

      res.json({
        message:
          'User deleted',
      })

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      })
    }
  }


// BLOCK / UNBLOCK USER

export const toggleBlockUser =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.params.id
        )

      if (!user) {

        return res.status(404).json({
          message:
            'User not found',
        })
      }

      // PREVENT ADMIN BLOCK
      if (
        user.role === 'admin'
      ) {

        return res.status(400).json({
          message:
            'Admin cannot be blocked',
        })
      }

      user.isBlocked =
        !user.isBlocked

      await user.save()

      res.json(user)

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      })
    }
  }