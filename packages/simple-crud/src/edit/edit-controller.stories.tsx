import type { StoryFn, Meta } from '@storybook/react';


import { Field } from 'react-final-form';

import { EditControllerProps, EditController, } from './edit-controller';
import { FormDebugger } from '@vebgen/mui-rff-debug';


interface FormData {
    id: string;
    title: string;
}

interface Context {
    one: 2;
}

// The properties passed to each story.
type StoryProps = EditControllerProps<FormData, Context>;


// Common configuration for all stories.
const storybookConfig: Meta<StoryProps> = {
    title: 'CRUD/EditController',
    tags: [],
    component: EditController,
    args: {
        onSuccess: () => { },
    },
    parameters: {
        fetchMock: {
            mocks: [

            ]
        }
    }
};
export default storybookConfig;


// Form content.
const Viewer = () => {
    return (
        <div>
            <Field name="id">
                {({ input, meta }) => (
                    <div>
                        <label>ID</label>
                        <input type="text" {...input} placeholder="ID" />
                        {
                            meta.touched &&
                            meta.error &&
                            <span>{meta.error}</span>
                        }
                    </div>
                )}
            </Field>
            <Field name="title">
                {({ input, meta }) => (
                    <div>
                        <label>Title</label>
                        <input type="text" {...input} placeholder="Title" />
                        {
                            meta.touched &&
                            meta.error &&
                            <span>{meta.error}</span>
                        }
                    </div>
                )}
            </Field>
            <button type="submit">Submit</button>
        </div>
    )
}


// Base for all stories in this file.
const Template: StoryFn<StoryProps> = () => {
    const validate = (values: FormData) => {
        const result: Record<string, string> = {};
        console.log("[EditController] validate %O", values);
        if (values.id === "0") {
            result["id"] = "ID cannot be zero";
        }
        if (!values.title) {
            result["title"] = "Title cannot be empty";
        }
        return result;
    };
    const initialValues = {
        id: "1",
        title: "Hello",
    };

    const onSuccess = (result: FormData) => {
        alert("[EditController] onSuccess");
    }

    const hookValue = {
        trigger: (values: FormData) => {
            return new Promise((resolve) => {
                alert("[EditController] trigger");
                resolve({
                    ...values,
                    title: values.title + "!",
                });
            });
        },
    }

    return (
        <EditController
            validate={validate}
            initialValues={initialValues}
            onSuccess={onSuccess}
            hookValue={hookValue as any}
        >
            <Viewer />
            <FormDebugger />
        </EditController>
    );
};


/**
 * The default story.
 */
export const Default: StoryFn<StoryProps> = Template.bind({});
Default.args = {};
