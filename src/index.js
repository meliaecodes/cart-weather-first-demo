import { fetchWeather, fetchProjectConfig, storeWeather } from './resolvers';
export { handler } from './resolvers';


export async function run(event, context) {
  console.log('Hello World!');
  console.log(event)
  console.log(event.issue.fields.project.id)
  console.log(event.issue.id)
  let config = await fetchProjectConfig(event.issue.fields.project.id);
  console.log(config)
  let currentWeather = await fetchWeather(config);
  console.log(currentWeather)
  console.log(await storeWeather(currentWeather, event.issue.id))
  console.log(context)
}