import React, {useContext, useState, useEffect, useRef} from 'react';
import {Table, Input, Button, Form} from 'antd';
import './tableForm.scss'

const EditableContext = React.createContext();

const EditableRow = ({index, ...props}) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = ({
                          title,
                          editable,
                          children,
                          dataIndex,
                          record,
                          handleSave,
                          ...restProps
                      }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef();
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };

    const save = async e => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({...record, ...values});
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;
    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
            >
                <Input.TextArea
                    autoSize={{maxRows: 4, minRows: 2}}
                    ref={inputRef}
                    onPressEnter={save}
                    onBlur={save}
                />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

class TableForm extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '编号',
                dataIndex: 'key',
                width: '10%',
                ellipsis: true,
            },
            {
                title: '步骤描述',
                dataIndex: 'step',
                width: '35%',
                ellipsis: true,
                editable: true,
            },
            {
                title: '预期结果',
                dataIndex: 'exception',
                width: '35%',
                ellipsis: true,
                editable: true,
            },
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record) =>
                    record.exception !== null || record.step !== null ? (
                        <Button
                            onClick={() => this.handleDelete(record.key)}
                            type={"primary"}
                            ghost={true}
                            danger={true}
                            size={"small"}
                        >
                            Delete
                        </Button>
                    ) : null,
            },
        ];
    }

    handleDelete = key => {
        const dataSource = this.props.value.reduce((pre,cur)=>{
            if (cur.key!==key){
                if (cur.key>key){
                    cur.key=cur.key-1
                }
                pre.push(cur)
            }
            return pre
        },[])
        this.props.onChange(
            dataSource
        )
    };

    handleSave = row => {
        const newData = [...this.props.value];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {...item, ...row});
        if ((row.step !== null || row.exception !== null) && index === (newData.length - 1)) {
            newData.push({key: this.props.value.length+1, step: null, exception: null})
        }
        this.props.onChange(newData)
    };

    render() {
        let dataSource = this.props.value;
        const components = {
            body: {
                row: EditableRow,
                cell: EditableCell,
            },
        };
        const columns = this.columns.map(col => {
            if (!col.editable) {
                return col;
            }

            return {
                ...col,
                onCell: record => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });
        return (
            <Table
                tableLayout={'fixed'}
                size='small'
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataSource}
                columns={columns}
                pagination={false}
            />
        );
    }
}

export default TableForm