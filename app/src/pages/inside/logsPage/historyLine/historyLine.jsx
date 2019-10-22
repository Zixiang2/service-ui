/*
 * Copyright 2019 EPAM Systems
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { activeProjectSelector } from 'controllers/user';
import classNames from 'classnames/bind';
import { historyItemsSelector, activeLogIdSelector, NAMESPACE } from 'controllers/log';
import { MANY, NOT_FOUND } from 'common/constants/launchStatuses';
import { connectRouter } from 'common/utils';
import { PAGE_KEY, DEFAULT_PAGINATION } from 'controllers/pagination';
import { HistoryLineItem } from './historyLineItem';
import styles from './historyLine.scss';

const cx = classNames.bind(styles);

@connectRouter(
  undefined,
  {
    changeActiveItem: (itemId) => ({ history: itemId, [PAGE_KEY]: DEFAULT_PAGINATION[PAGE_KEY] }),
  },
  { namespace: NAMESPACE },
)
@connect((state) => ({
  projectId: activeProjectSelector(state),
  historyItems: historyItemsSelector(state),
  activeItemId: activeLogIdSelector(state),
}))
export class HistoryLine extends Component {
  static propTypes = {
    projectId: PropTypes.string,
    historyItems: PropTypes.array,
    activeItemId: PropTypes.number,
    changeActiveItem: PropTypes.func,
  };

  static defaultProps = {
    projectId: '',
    historyItems: [],
    activeItemId: 0,
    changeActiveItem: () => {},
  };

  checkIfTheItemLinkIsActive = (item) =>
    item.id !== this.props.activeItemId &&
    (item.status.toLowerCase() !== MANY && item.status.toLowerCase() !== NOT_FOUND);

  render() {
    return (
      <div className={cx('history-line')}>
        {this.props.historyItems &&
          this.props.historyItems.map((item, index) => (
            <HistoryLineItem
              key={item.launchNumber}
              active={item.id === this.props.activeItemId}
              isFirstItem={index === 0}
              isLastItem={index === this.props.historyItems.length - 1}
              onClick={() =>
                this.checkIfTheItemLinkIsActive(item) ? this.props.changeActiveItem(item.id) : {}
              }
              path={item.path}
              projectId={this.props.projectId}
              {...item}
            />
          ))}
      </div>
    );
  }
}
