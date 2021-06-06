import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Local from 'App/Models/Local'
import Appreciatelocal from './Appreciatelocal'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column()
  public password: string

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Local, {
    foreignKey: 'userId',
  })
  public locals: HasMany<typeof Local>

  @hasMany(() => Appreciatelocal, {
    foreignKey: 'userId',
  })
  public appreciatelocals: HasMany<typeof Appreciatelocal>
}
