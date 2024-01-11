import { useEffect, useState } from "react";
import type { StoryFn, Meta } from '@storybook/react';
import { UseCrudProps, useCrud } from "./hook";


// The type of the element in the detail query.
interface SomeType {
    id: string;
    title: string;
    details: string;
}

// Story data.
const storyData: SomeType[] = [
    {
        id: "lorem",
        title: "ipsum",
        details: "dolor",
    },
    {
        id: "sit",
        title: "amet",
        details: "consectetur",
    },
    {
        id: "adipiscing",
        title: "elit",
        details: "sed",
    },
    {
        id: "do",
        title: "eiusmod",
        details: "tempor",
    },
];


function delay(t: number) {
    return new Promise(resolve => setTimeout(resolve, t));
}


// The hook for list fetch.
const useFetchList = () => {
    const [data, setData] = useState<any>({
        result: undefined,
        loading: true,
        error: undefined,
        trigger: (() => { }) as any,
        reset: () => { },
    });

    useEffect(() => {
        delay(1000).then(() => setData({
            result: storyData,
            loading: false,
            error: undefined,
            trigger: (() => { }) as any,
            reset: () => { },
        }));
    }, []);

    return data
};

type ListKey = "lorem" | "sit" | "adipiscing" | "do";
type StoryProps = UseCrudProps<SomeType, ListKey>

// Common configuration for all stories.
const storybookConfig: Meta<StoryProps> = {
    title: 'CRUD/use2StageList',
    tags: [],
    args: {
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
        useFetchList: useFetchList as any,
        toKey: (item: SomeType) => item.id as ListKey,
    },
    parameters: {
        fetchMock: {
            mocks: [

            ]
        }
    }
};
export default storybookConfig;

// Tell if a value is true or false.
const Value = ({ on }: { on: boolean }) => (
    <td>{on ? "✅" : "❌"}</td>
)


// Base for all stories in this file.
const Template: StoryFn<StoryProps> = (props) => {
    const {
        canCreate,
        canRead,
        canUpdate,
        canDelete,
        isListLoading,
        errorInList,
        current,
        mode,
        reloadList,
        resetList,
        beginCreate,
        beginEdit,
        beginView,
        beginDelete,
        setCurrent,
        clearCurrent,
        data,
    } = useCrud(props);
    return (
        <table>
            <caption>
                useCrud
            </caption>
            <tbody>
                <tr>
                    <th>canCreate</th>
                    <Value on={canCreate} />
                </tr>
                <tr>
                    <th>canRead</th>
                    <Value on={canRead} />
                </tr>
                <tr>
                    <th>canUpdate</th>
                    <Value on={canUpdate} />
                </tr>
                <tr>
                    <th>canDelete</th>
                    <Value on={canDelete} />
                </tr>
                <tr>
                    <th>isListLoading</th>
                    <Value on={isListLoading} />
                </tr>
                <tr>
                    <th>errorInList</th>
                    <td>{errorInList ? errorInList.message : null}</td>
                </tr>
                <tr>
                    <th>current</th>
                    <td>{current}</td>
                </tr>
                <tr>
                    <th>mode</th>
                    <td>{mode}</td>
                </tr>
                <tr>
                    <th colSpan={2}><hr /></th>
                </tr>
                {
                    Object.keys(data).map(key => (
                        <tr key={key}>
                            <td>{key}</td>
                            <td>{data[key as ListKey].title}</td>
                        </tr>
                    ))
                }
            </tbody>
            <tfoot>
                <tr>
                    <th colSpan={2}><hr /></th>
                </tr>
                <tr>
                    <th colSpan={2}>
                        <button onClick={() => reloadList()}>
                            Reload list
                        </button>
                        <button onClick={() => resetList()}>
                            Reset list
                        </button>
                        <button onClick={() => beginCreate()}>
                            Begin Create
                        </button>
                        <button onClick={() => beginView(
                            storyData[0].id as ListKey
                        )}>
                            Begin View
                        </button>
                        <button onClick={() => beginEdit(
                            storyData[0].id as ListKey
                        )}>
                            Begin edit
                        </button>
                        <button onClick={() => beginDelete(
                            storyData[1].id as ListKey
                        )}>
                            Begin delete
                        </button>
                        <button onClick={() => setCurrent(
                            storyData[2].id as ListKey
                        )}>
                            Set current
                        </button>
                        <button onClick={() => clearCurrent()}>
                            Clear current
                        </button>
                    </th>
                </tr>
            </tfoot>
        </table>
    );
}

/**
 * The default story. All permissions are allowed.
 */
export const AllAllowed: StoryFn<StoryProps> = Template.bind({});
AllAllowed.args = {};
