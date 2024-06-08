import {Users} from './users';
import pool from './database';

console.log("this is a index file");

let Users1 = new Users('harsh',23);
Users1.getDetails();



interface Employee {
    id: number;
    name: string;
    position: string;
  }

async function main() {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM Users');
    
    // Log the data retrieved from the database
    rows.forEach((row:any) => {
      console.log(`ID: ${row.ID}, Name: ${row.name}, Position: ${row.role}`);
    });
    
    connection.release();
    pool.end();
  } catch (err) {
    console.error('Error executing query', err);
  }
  
}

main();
