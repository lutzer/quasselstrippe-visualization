import DataEditor, { DataSchema } from 'node-data-editor'
import { Low, JSONFile } from 'lowdb'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'

import {fileURLToPath} from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

type JsonDict = { [id: string] : any[] }
type Options = { initialData?: any[], autoIncrement?: boolean, autoTimestamp?: boolean }

class LowDbAdapter<DataType extends JsonDict> extends DataEditor.Adapter {
  
  file: string
  primaryKey: string
  table: string
  options : Options

  constructor(file : string, table : string, primaryKey: string, {initialData = [], autoIncrement = false, autoTimestamp = false} : Options = {} ) {
    super()
    this.file = file
    this.primaryKey = primaryKey
    this.table = table
    this.options = {initialData, autoIncrement, autoTimestamp}
  }

  async getDatabase() : Promise<Low<DataType>> {
    const adapter = new JSONFile<DataType>(path.join(__dirname,this.file))
    const db = new Low(adapter)
    await db.read()

    // init default values
    if (db.data == null || db.data[this.table] == null) {
      db.data = Object.assign({}, db.data, { [this.table] : this.options.initialData } );
    }

    return db
  }

  async list(): Promise<any[]> {
    var db = await this.getDatabase()
    return db.data![this.table]
  }

  async read(id: string): Promise<any> {
    var db = await this.getDatabase()
    return db.data![this.table].find((e : any) => e[this.primaryKey] == id)
  }

  async update(id: string, data: any): Promise<any> {
    var db = await this.getDatabase()
    db.data = Object.assign(db.data!, { 
      [this.table] : db.data![this.table].map((e : any) => {
        return e[this.primaryKey] == id ? data : e
      }) 
    })
    await db.write()
    return data
  }

  async delete(id: string): Promise<void> {
    var db = await this.getDatabase()
    db.data = Object.assign(db.data!, { 
      [this.table] : db.data![this.table].filter((e : any) =>  { 
        return e[this.primaryKey] != id 
      })
    })
    db.write()
  }

  async create(data: any): Promise<any> {
    var db = await this.getDatabase()
    data[this.primaryKey] = this.options.autoIncrement ? uuidv4() : data[this.primaryKey]
    data["timestamp"] = this.options.autoTimestamp ? Date.now() : data["timestamp"]
    db.data![this.table].push(data)
    await db.write()
    return data
  }
}

export { LowDbAdapter }