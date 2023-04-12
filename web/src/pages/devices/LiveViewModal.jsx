import {Modal} from "antd";
import {useEffect} from "react";
import {actionsSelector, fetchActions} from "../../redux";
import {useDispatch, useSelector} from "react-redux";

const LiveViewModal = ({device, onClose}) => {
  const dispatch = useDispatch();
  const actions = useSelector(actionsSelector);
  const signals = actions.filter(action => action.name === "LIVESTREAM_CLIENT")

  useEffect(() => {
    if(device) {
      dispatch(fetchActions(device.deviceUUID()))
    }
    const intervalId = setInterval(() => {
      if(device) {
        dispatch(fetchActions(device.deviceUUID()))
      }
    }, 500)

    return () => clearInterval(intervalId); //This is important
  }, [device])
  return <Modal
    title={null}
    open={!!device}
    footer={null}
    closable={false}
    wrapClassName="video-modal"
    centered
    onCancel={onClose}
  >
    {JSON.stringify(signals)}
  </Modal>
}

export default LiveViewModal;