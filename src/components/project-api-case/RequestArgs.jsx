import React, {useContext, useState, useEffect, useRef} from 'react';
import {Table, Input, Button, Form} from 'antd';
import './requestArgs.scss'

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
                <Input ref={inputRef} onPressEnter={save} onBlur={save}/>
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                    height:32
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: 'Key',
                dataIndex: 'arg',
                width: '40%',
                ellipsis: true,
                editable: true,
            },
            {
                title: 'Value',
                dataIndex: 'value',
                width: '40%',
                ellipsis: true,
                editable: true,
            },
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record) =>
                    record.arg !== null || record.value !== null ? (
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

        const initData = this.props.initValue ?
            Object.keys(this.props.initValue).map((item, index) => {
                    return {
                        key: index,
                        arg: item,
                        value: this.props.initValue[item]
                    }
                }
            ) : []
        initData.push({key: initData.length, arg: null, value: null})
        this.state = {
            dataSource: initData,
            count: initData.length,
        };
    }

    getDataSource = () => {
        const returnData = {}
        this.state.dataSource.forEach(item => {
            if (item.arg || item.value) {
                returnData[[item.arg]] = item.value
            }
        })
        if (Object.keys(returnData).length === 0) {
            return null
        }
        return returnData
    }

    handleDelete = key => {
        const dataSource = [...this.state.dataSource];
        this.setState({
            dataSource: dataSource.filter(item => item.key !== key),
        });
    };

    handleSave = row => {
        const newData = [...this.state.dataSource];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {...item, ...row});
        if ((row.arg!==null || row.value!==null) && index === (newData.length - 1)) {
            newData.push({key: this.state.count + 1, arg: null, value: null})
            this.setState({
                dataSource: newData,
                count: this.state.count + 1
            })
        } else {
            this.setState({
                dataSource: newData,
            });
        }
    };

    render() {
        const {dataSource} = this.state;
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

export default EditableTable