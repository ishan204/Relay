import {client} from './db.js'

async function main() {
    await client.connect()
    const result = await client.query(
        "SELECT * FROM employee;"
    )
    console.log(result.rows)
    await client.end()
}

main()