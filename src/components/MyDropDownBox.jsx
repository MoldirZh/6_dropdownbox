import React from 'react'
import { useContext, useCallback } from 'react'
import { MyContext } from '../App'
import DropDownBox from 'devextreme-react/drop-down-box'
import MyDataGrid from './MyDataGrid'

const gridBoxDisplayExpr = (item) => {
  return item && `${item.CompanyName} <${item.Phone}>`;
}

const MyDropDownBox = () => {

  const { state, dispatch, dataSource } = useContext(MyContext)

  let { value, opened, dataGridInstance, isKeyDown, isClick } = state;

  const onValueChanged = useCallback((args) => {
    if (isKeyDown)
      dispatch({ type: 'ALL', value: args.value, opened: false })
    if (isClick)
      dispatch({ type: 'ALL', value: args.value, opened: true })
  }, [dispatch, isKeyDown, isClick])

  const onKeyDown = useCallback((e) => {
    if (e.event.originalEvent.keyCode !== 40 && e.event.originalEvent.keyCode !== 38)
      return; //not arrow up or down
    if (!opened) {
      dispatch({ type: 'OPEN_CLOSE', opened: true })
    } else dataGridInstance && dataGridInstance.focus();
  }, [dispatch, dataGridInstance, opened])

  const onOpened = useCallback((e) => {
    let ddbInstance = e.component;
    dataSource.load().done(items => {
      if (items.length > 0) {
        dispatch({ type: 'FOCUSED_ROW_KEY', focusedRowKey: value[0] })
      }
      ddbInstance.focus();
    })
  }, [dataSource, dispatch, value])

  const onOptionChanged = useCallback((args) => {
    if (args.name === "opened") {
      dispatch({ type: 'OPEN_CLOSE', opened: args.value })
    }
  }, [dispatch])

  return (
    <DropDownBox
      value={value}
      showClearButton={true}
      onOpened={onOpened}
      opened={opened}
      displayExpr={gridBoxDisplayExpr}
      placeholder="Select a value..."
      dataSource={dataSource}
      onKeyDown={onKeyDown}
      onValueChanged={onValueChanged}
      onOptionChanged={onOptionChanged}
      contentComponent={MyDataGrid}
    />
  )
}

export default MyDropDownBox