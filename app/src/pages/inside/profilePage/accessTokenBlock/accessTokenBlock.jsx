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
import track from 'react-tracking';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import classNames from 'classnames/bind';
import { showModalAction } from 'controllers/modal';
import { apiTokenValueSelector, generateApiTokenAction } from 'controllers/user';
import WarningLockImage from 'common/img/warning-lock.png';
import { GhostButton } from 'components/buttons/ghostButton';
import { PROFILE_PAGE_EVENTS } from 'components/main/analytics/events';
import { StripedMessage } from 'components/main/stripedMessage';
import Parser from 'html-react-parser';
import IconDuplicate from 'common/img/duplicate-inline.svg';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ButtonWithTooltip } from './buttonWithTooltip';
import styles from './accessTokenBlock.scss';
import { BlockContainerHeader, BlockContainerBody } from '../blockContainer';

const cx = classNames.bind(styles);
const messages = defineMessages({
  header: {
    id: 'AccessTokenBlock.header',
    defaultMessage: 'Access token',
  },
  regenerate: {
    id: 'AccessTokenBlock.regenerate',
    defaultMessage: 'Regenerate',
  },
  text: {
    id: 'AccessTokenBlock.text',
    defaultMessage:
      'In order to provide security for your own domain password, you can use a user token - to verify your account to be able to log with agent.',
  },
  warningHeader: {
    id: 'AccessTokenBlock.warningHeader',
    defaultMessage: 'Keep the token safe!',
  },
  warning: {
    id: 'AccessTokenBlock.warning',
    defaultMessage: "This token shouldn't be shared or published at any type of public sources.",
  },
  regenerateSuccess: {
    id: 'AccessTokenBlock.regenerateSuccess',
    defaultMessage: 'Changes have been saved successfully',
  },
  regenerateError: {
    id: 'AccessTokenBlock.submitError',
    defaultMessage: "Error! Can't regenerate access token",
  },
});

@connect(
  (state) => ({
    token: apiTokenValueSelector(state),
  }),
  { showModalAction, generateApiTokenAction },
)
@injectIntl
@track()
export class AccessTokenBlock extends Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    showModalAction: PropTypes.func.isRequired,
    generateApiTokenAction: PropTypes.func.isRequired,
    token: PropTypes.string,
    tracking: PropTypes.shape({
      trackEvent: PropTypes.func,
      getTrackingData: PropTypes.func,
    }).isRequired,
  };

  static defaultProps = {
    token: '',
  };

  onGenerate = () => {
    this.props.tracking.trackEvent(PROFILE_PAGE_EVENTS.REGENERATE_BTN);
    this.props.showModalAction({
      id: 'regenerateAccessTokenModal',
      data: { onRegenerate: this.regenerateHandler },
    });
  };

  regenerateHandler = () => {
    this.props.generateApiTokenAction({
      successMessage: this.props.intl.formatMessage(messages.regenerateSuccess),
      errorMessage: this.props.intl.formatMessage(messages.regenerateError),
    });
  };

  render = () => {
    const {
      intl: { formatMessage },
    } = this.props;

    return (
      <div className={cx('access-token-block')}>
        <BlockContainerHeader>
          <span className={cx('header-label')}>{formatMessage(messages.header)}</span>
        </BlockContainerHeader>
        <BlockContainerBody>
          <div className={cx('body-wrapper')}>
            <div className={cx('field-wrapper')}>
              <span className={cx('label')}>{formatMessage(messages.header)}</span>
              <div className={cx('token-value-block')}>
                {this.props.token}
                <CopyToClipboard text={this.props.token} className={cx('copy')}>
                  {Parser(IconDuplicate)}
                </CopyToClipboard>
              </div>
              <div className={cx('regenerate-btn')}>
                <ButtonWithTooltip>
                  <GhostButton onClick={this.onGenerate}>
                    {formatMessage(messages.regenerate)}
                  </GhostButton>
                </ButtonWithTooltip>
              </div>
            </div>
            <p className={cx('tip')}>{formatMessage(messages.text)}</p>
            <StripedMessage
              header={formatMessage(messages.warningHeader)}
              image={WarningLockImage}
              type="warning"
            >
              {formatMessage(messages.warning)}
            </StripedMessage>
          </div>
        </BlockContainerBody>
      </div>
    );
  };
}
