import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Appreciatelocals extends BaseSchema {
  protected tableName = 'appreciatelocals'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('rating').notNullable()
      table.integer('comment').notNullable()
      table.integer('local_id').unsigned().references('locals.id').onDelete('CASCADE')
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
