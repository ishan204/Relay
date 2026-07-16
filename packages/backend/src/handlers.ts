export async function testHandler(payload: unknown) {
  console.log("Processing", payload);
  await new Promise((resolve) => setTimeout(resolve, 8000));
  const result = "This is the result of the task";
  return result;
}
export async function testFailureHandler(payload: unknown) {
  await new Promise((resolve) => setTimeout(resolve, 8000));
  throw new Error("Unable to process the request, Intentional Error");
}
