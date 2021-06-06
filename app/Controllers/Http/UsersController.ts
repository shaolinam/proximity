import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class UsersController {
  public async create({ request }: HttpContextContract) {
    const userSchema = schema.create({
      email: schema.string({ trim: true }, [
        rules.unique({ table: 'users', column: 'email' }),
        rules.regex(/^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/),
      ]),
      password: schema.string({}, [rules.minLength(8)]),
    })

    const data = await request.validate({ schema: userSchema })

    const user = await User.create(data)
    return user
  }

  public async index() {
    const users = User.all()
    return users
  }
  public async findById({ request }: HttpContextContract) {
    const id = request.param('id')
    const user = await User.find(id)
    return user
  }
  public async findByEmail({ request }: HttpContextContract) {
    const email = request.param('email')
    const user = await User.findByOrFail('email', email)
    return user
  }
  public async update({ auth, request, response }: HttpContextContract) {
    await auth.use('api').authenticate()

    const { email, password } = request.only(['email', 'password'])
    const id = request.param('id')
    const user = await User.findOrFail(id)
    const userToken = auth.use('api').user

    if (user.id !== (userToken && userToken.id)) {
      return response.status(403).send({
        errors: [
          {
            rule: 'permission',
            field: '',
            message: 'Forbidden access',
          },
        ],
      })
    } else {
      if (!this.isValidEmail(email))
        return response.status(422).send({
          errors: [
            {
              rule: 'regex',
              field: 'email',
              message: 'regex validation failed',
            },
          ],
        })

      const userSchema = schema.create({
        email: schema.string({ trim: true }, [
          rules.regex(/^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/),
        ]),
        password: schema.string({}, [rules.minLength(8)]),
      })

      await request.validate({ schema: userSchema })

      user.email = email
      user.password = password

      await user.save()

      return user
    }
  }
  public async delete({ auth, request, response }: HttpContextContract) {
    await auth.use('api').authenticate()

    const id = request.param('id')
    const user = await User.findOrFail(id)
    const userToken = auth.use('api').user

    await user.delete()

    if (user.id === (userToken && userToken.id)) {
      await this.logout({ auth, response })
    }

    return user
  }
  public async login({ auth, request, response }) {
    const email = request.input('email')
    const password = request.input('password')

    if (!this.isValidEmail(email))
      return response.status(422).send({
        errors: [
          {
            rule: 'regex',
            field: 'email',
            message: 'regex validation failed',
          },
        ],
      })

    try {
      const user = await User.query().where('email', email).firstOrFail()

      if (!(await Hash.verify(user.password, password))) {
        return response.status(404).send({ message: 'Login Invalid' })
      }

      const token = await auth.use('api').attempt(email, password)
      return token
    } catch (error) {
      return response.status(404).send({ message: 'User not found' })
    }
  }
  public async logout({ auth, response }) {
    await auth.use('api').revoke()
    return response.send({ message: 'Logout with success !' })
  }

  public isValidEmail(email: string): boolean {
    const mailformat = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/
    if (email.match(mailformat)) {
      return true
    } else {
      return false
    }
  }
}
