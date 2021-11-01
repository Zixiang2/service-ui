/*
 * Copyright 2021 EPAM Systems
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

import classNames from 'classnames/bind';
import { GhostButton } from 'components/buttons/ghostButton';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { showModalAction } from 'controllers/modal';
import PropTypes from 'prop-types';
import { IN_PROGRESS } from 'common/constants/testStatuses';
import { injectIntl } from 'react-intl';
import { fetch } from 'common/utils';
import { URLS } from 'common/urls';
import { activeProjectSelector } from 'controllers/user';
import {
  NOTIFICATION_TYPES,
  showDefaultErrorNotification,
  showNotification,
} from 'controllers/notification';
import { SpinningPreloader } from 'components/preloaders/spinningPreloader';
import { loadingSelector } from 'controllers/uniqueErrors';
import { RP_CLUSTER_LAST_RUN } from '../constants';
import { messages } from '../messages';
import styles from './emptyUniqueErrors.scss';

const cx = classNames.bind(styles);

@injectIntl
@connect(
  (state) => ({
    projectId: activeProjectSelector(state),
    loading: loadingSelector(state),
  }),
  {
    showModal: showModalAction,
    showNotification,
    showDefaultErrorNotification,
  },
)
export class EmptyUniqueErrors extends Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    projectId: PropTypes.string,
    showModal: PropTypes.func,
    showNotification: PropTypes.func,
    showDefaultErrorNotification: PropTypes.func,
    parentLaunch: PropTypes.object,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    projectId: '',
    showModal: () => {},
    showNotification: () => {},
    showDefaultErrorNotification: () => {},
    parentLaunch: {},
    loading: false,
  };

  onSubmit = ({ removeNumbers }) => {
    const { projectId, parentLaunch } = this.props;
    fetch(URLS.runUniqueErrorAnalysis(projectId), {
      method: 'POST',
      data: {
        launchId: parentLaunch.id,
        removeNumbers,
      },
    })
      .then(({ message }) => {
        this.props.showNotification({
          message,
          type: NOTIFICATION_TYPES.SUCCESS,
        });
      })
      .catch(this.props.showDefaultErrorNotification);
  };

  openModal = () => {
    this.props.showModal({
      id: 'uniqueErrorsAnalyzeModal',
      data: {
        onSubmit: this.onSubmit,
      },
    });
  };

  render() {
    const {
      parentLaunch,
      loading,
      intl: { formatMessage },
    } = this.props;
    const lastRunAnalysis =
      parentLaunch.attributes &&
      parentLaunch.attributes.find((item) => item.key === RP_CLUSTER_LAST_RUN);
    const disabled = parentLaunch.status === IN_PROGRESS;

    return (
      <>
        {loading ? (
          <SpinningPreloader />
        ) : (
          <div className={cx('empty-unique-errors')}>
            <div className={cx('empty-unique-errors-content')}>
              <div className={cx('empty-unique-errors-img')} />
              <p className={cx('empty-unique-errors-headline')}>
                {formatMessage(messages.emptyUniqueErrHeadline)}
              </p>

              <p className={cx('empty-unique-errors-text')}>
                {lastRunAnalysis
                  ? formatMessage(messages.rerunAnalysisText)
                  : formatMessage(messages.emptyUniqueErrText)}
              </p>

              <div className={cx('empty-unique-errors-btn')}>
                <GhostButton
                  onClick={this.openModal}
                  disabled={disabled}
                  title={disabled ? formatMessage(messages.emptyUniqueErrDisableBtnTooltip) : null}
                >
                  {formatMessage(messages.emptyUniqueErrBtn)}
                </GhostButton>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}
