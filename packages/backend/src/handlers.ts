
export async function testHandler(payload: unknown){
    console.log("Processing", payload)
    await new Promise(
        resolve => setTimeout(resolve, 5000)
    )
    const result = {
        message: "This is the result of this action"
    }
    return result
}
export async function testFailureHandler(payload: unknown){
    console.log("Processing", payload)
    await new Promise(
        resolve => setTimeout(resolve, 8000)
    )
    throw new Error("Unable to process the request, Intentional Error")
}