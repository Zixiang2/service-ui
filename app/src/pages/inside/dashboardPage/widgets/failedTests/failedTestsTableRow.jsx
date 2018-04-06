import * as React from 'react';
import { func } from 'prop-types';
import classNames from 'classnames/bind';
import { AbsRelTime } from 'components/main/absRelTime';
import { PTTest } from './pTypes';
import styles from './failedTests.scss';

const cx = classNames.bind(styles);

class FailedTestsTableRow extends React.PureComponent {

  static propTypes = {
    data: PTTest.isRequired,
    nameClickHandler: func.isRequired,
  }

  nameClickHandler = () => {
    const { nameClickHandler, data } = this.props;
    nameClickHandler(data.uniqueId);
  }

  render() {
    const { data } = this.props;
    const {
      name, total, isFailed, percentage,
      lastTime, uniqueId, failedCount,
    } = data;

    return (
      <div key={uniqueId} className={cx('row')}>
        <div
          className={cx('col', 'col-name')}
          onClick={this.nameClickHandler}
        >
          <span>{name}</span>
        </div>
        <div className={cx('col', 'col-count')}>
          <div className={cx('count')}>{`${failedCount} of ${total}`}</div>
          <div className={cx('matrix')}>
            <div className={cx('squares-wrapper')}>
              {
                /* eslint-disable */
                isFailed.map((failed, idx) => <div key={`${uniqueId}-square-${idx}`} className={cx('square', { failed })} />)
                /* eslint-disable */
              }
            </div>
          </div>
        </div>
        <div className={cx('col', 'col-percents')}>{percentage}</div>
        <div className={cx('col', 'col-date')}>
          <AbsRelTime
            startTime={lastTime}
          />
        </div>
      </div>
    );
  }
}

export default FailedTestsTableRow;
