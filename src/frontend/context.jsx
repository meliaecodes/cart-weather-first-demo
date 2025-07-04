import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Heading, Text } from '@forge/react';
import { invoke, view, requestJira } from '@forge/bridge';

const App = () => {
  const [data, setData] = useState(null);
  const [projectConfig, setProjectConfig] = useState(null);
  const [storedWeather, setStoredWeather] = useState(null);
  const [context, setContext] = useState(null);

  useEffect(() => {
    console.log('current weather data changed')
    console.log(data)
  }, [data]);

  useEffect(() => {
    console.log('stored weather changed')
    console.log(storedWeather)
  }, [storedWeather]);

  useEffect(() => {
    console.log('Project config changed')
    console.log(projectConfig)
    if(projectConfig !== null) {
      console.log('Getting weather')
      invoke('getWeather', { config: projectConfig}).then(setData);
    }
  }, [projectConfig]);

  useEffect(() => {
    view.getContext().then(setContext);
  }, []);
  
  useEffect(() => {
    console.log('Context changed')

    if(context !== null) {
      console.log(context);
      fetchProjectConfig();
      fetchIssueConfig();
      console.log(context.value);
    }

  }, [context]);


  const fetchProjectConfig = async () => {
    const response = await requestJira(`/rest/api/3/project/${context.extension.project.id}/properties/dev-day-app-project-settings-page`)
    const storedProjectData = await response.json();
    setProjectConfig(storedProjectData.value)
  }

    const fetchIssueConfig = async () => {
    const response = await requestJira(`/rest/api/3/issue/${context.extension.issue.id}/properties/dev-day-app-weather`)
    const storedIssueData = await response.json();
    setStoredWeather(storedIssueData.value)
  }

  return (
    <>
      <Heading size="medium">Track Conditions</Heading>
      { projectConfig ? <Text>{JSON.stringify(projectConfig)}</Text> : <Text>Loading...</Text>}
      <Heading size="small">Current conditions</Heading>
      { data ? <Text>{JSON.stringify(data)}</Text> : <Text>Loading...</Text>}
      { storedWeather && <Heading size="small">Stored conditions</Heading> }
      { storedWeather && <Text>{JSON.stringify(storedWeather)}</Text> }
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
