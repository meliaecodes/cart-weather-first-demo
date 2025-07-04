import React, { useEffect, useState } from 'react';
import ForgeReconciler, { 
  Box, Button, Form, FormHeader,FormFooter,  FormSection, Heading, Inline,  Label, 
  RadioGroup, RequiredAsterisk, Textfield, Text, useForm } from '@forge/react';
import { requestJira, view } from '@forge/bridge';

const App = () => {
  const [editView, setEditView] = useState(false);
  const [context, setContext] = useState(null);
  const [projectConfig, setProjectConfig] = useState(null);
  const { getFieldId, register, handleSubmit } = useForm();

  useEffect(() => {
    view.getContext().then(setContext);
  }, []);

  useEffect(() => {
    console.log('Project config changed')
    console.log(projectConfig)
  }, [projectConfig]);

  const fetchProjectConfig = async () => {
    const response = await requestJira(`/rest/api/3/project/${context.extension.project.id}/properties/${context.moduleKey}`)
    const storedProjectData = await response.json();
    setProjectConfig(storedProjectData.value)
  }

  const storeProjectConfig = async (settings) => {
    console.log('Store project config...')
    console.log(settings)
    // todo check data is ok 

    var bodyData = `{
      "lon" : ${settings.lon},
      "lat" : ${settings.lat},
      "tempUnit" : "${settings.tempUnit}"
    }`;

    const response = await requestJira(`/rest/api/3/project/${context.extension.project.id}/properties/${context.moduleKey}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: bodyData
    })
    console.log(response);
    fetchProjectConfig();
    // todo check for errors
  }

  useEffect(() => {
    console.log('Context changed')

    if(context !== null) {
      console.log(context);
      fetchProjectConfig();
      console.log(context.value);
    }

  }, [context]);


  const onSubmit = (data) => {
    console.log(data);
    setEditView(false);
    if(context !== null) {
      storeProjectConfig(data);
    } 
  };

  const displayForm = () => {
    return (
      <>
        { projectConfig && <Text>Track coordinates: {projectConfig.lat}, {projectConfig.lon}</Text>}
        { projectConfig && <Text>Temperature units: {projectConfig.tempUnit} </Text>}
        <Button onClick={() => setEditView(true)}>Edit</Button>
      </>
    )
  }
  const editForm = () => {
    // Albert Park latitude and longitude
    // -37.843681, 144.951035
    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
        <FormHeader title="Edit Track Condition Settings">
          Required fields are marked with an asterisk <RequiredAsterisk />
        </FormHeader>
        <FormSection>
          <Box paddingBlockEnd="space.100">
            <Heading size="small">Track Location</Heading>
            <Inline>
              <Box paddingInlineStart="space.100">
                <Label labelFor="lon">Longitude<RequiredAsterisk /></Label>
                <Textfield {...register("lon")} name="lon" placeholder="144.951035"/>
              </Box>
              <Box paddingInlineStart="space.100">
                <Label labelFor="lat">Latitude<RequiredAsterisk /></Label>
                <Textfield {...register("lat")} name="lat" placeholder="-37.843681"/>
              </Box>
            </Inline>
          </Box>
          <Heading size="small">Other settings</Heading>
          <Box paddingInlineStart="space.100">
            <Label labelFor={getFieldId("tempUnit")}>Temperature units<RequiredAsterisk /></Label>
            <RadioGroup
              options={[
                { name: "tempUnit", value: "metric", label: "metric (°C)" },
                { name: "tempUnit", value: "imperial", label: "imperial (°F)" },
              ]}
              {...register("tempUnit")}
            />
          </Box>
        </FormSection>
        <FormFooter>
          <Button appearance="primary" type="submit">
            Submit
          </Button>
        </FormFooter>
      </Form>
    )
  }

  return (
    <>
      {!editView && displayForm()}
      {editView && editForm()}    
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
