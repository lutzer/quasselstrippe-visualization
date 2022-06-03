import DataEditor from 'node-data-editor'
import path from 'path'
import { Low, JSONFile } from 'lowdb'

type JsonDict = { [id: string] : any };

class LowDbAdapter<DataType extends JsonDict> extends DataEditor.Adapter {
  
  file: string
  primaryKey: string
  table: string
  intialData: DataType

  constructor(file : string, table : string, primaryKey : string, initialData: DataType) {
    super()
    this.file = file;
    this.primaryKey = primaryKey
    this.table = table
    this.intialData = initialData
  }

  async getDatabase() : Promise<Low<DataType>> {
    const adapter = new JSONFile<DataType>(path.join(__dirname, this.file))
    const db = new Low(adapter)
    await db.read();
    db.data ||= this.intialData
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
  async update(id: string, data: any): Promise<void> {
    var db = await this.getDatabase()
    // db.data![this.table] = db.data![this.table].map((e : any) => {
    //   return e[this.primaryKey] == id ? data : e; 
    // })
    // db.write()
  }
  async delete(id: string): Promise<void> {
    var db = await this.getDatabase()
    // db.data[this.table] = db.data![this.table].filter((e : any) =>  { 
    //   return e[this.primaryKey] != id 
    // })
    // db.write()
  }
  async create(data: any): Promise<any> {
    var db = await this.getDatabase()
    db.data![this.table].push(data)
    await db.write()
  }
}
export { LowDbAdapter }