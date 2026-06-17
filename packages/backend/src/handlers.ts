
export async function testHandler(payload: unknown){
    console.log("Processing", payload)
    await new Promise(
        resolve => setTimeout(resolve, 5000)
    )
}
export async function testFailureHandler(payload: unknown){
    console.log("Processing", payload)
    await new Promise(
        resolve => setTimeout(resolve, 8000)
    )
    throw new Error("Unable to process the request")
}