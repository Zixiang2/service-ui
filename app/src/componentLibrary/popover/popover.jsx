/*
 * Copyright 2022 EPAM Systems
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

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { useOnClickOutside } from 'common/hooks';
import styles from './popover.scss';

const cx = classNames.bind(styles);
const TRIANGLE_SIZE = 9;
const SAFE_ZONE = 4;

export const Popover = ({
  children,
  title,
  trianglePosition,
  dataAutomationId,
  onClose,
  parentRef,
}) => {
  const popoverRef = useRef();
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);

  useOnClickOutside(popoverRef, onClose);

  const { side, position } = trianglePosition;

  useEffect(() => {
    const { current: parent } = parentRef;
    const parentTop = parent.offsetTop;
    const parentLeft = parent.offsetLeft;
    const parentHeight = parent.offsetHeight;
    const parentWidth = parent.offsetWidth;

    const { current: popover } = popoverRef;
    const popoverHeight = popover.offsetHeight;
    const popoverWidth = popover.offsetWidth;

    const setHorizontalPosition = () => {
      switch (position) {
        case 'right':
          setLeft(parentLeft + parentWidth / 2 - popoverWidth + TRIANGLE_SIZE + 16);
          break;
        case 'middle':
          setLeft(parentLeft + parentWidth / 2 - popoverWidth / 2);
          break;
        case 'left':
        default:
          setLeft(parentLeft + parentWidth / 2 - TRIANGLE_SIZE - 16);
      }
    };

    const setVerticalMiddlePosition = () => {
      setTop(parentTop + parentHeight / 2 - popoverHeight / 2);
    };

    if (side === 'top') {
      setTop(parentTop + parentHeight + SAFE_ZONE + TRIANGLE_SIZE);
      setHorizontalPosition();
    } else if (side === 'bottom') {
      setTop(parentTop - SAFE_ZONE - TRIANGLE_SIZE - popoverHeight);
      setHorizontalPosition();
    } else if (side === 'left') {
      setVerticalMiddlePosition();
      setLeft(parentLeft + parentWidth + SAFE_ZONE + TRIANGLE_SIZE);
    } else if (side === 'right') {
      setVerticalMiddlePosition();
      setLeft(parentLeft - SAFE_ZONE - TRIANGLE_SIZE - popoverWidth);
    }
  }, [parentRef, popoverRef, side, position]);

  return (
    <div
      className={cx('popover', `side-${side}`, `position-${position}`)}
      data-automation-id={dataAutomationId}
      ref={popoverRef}
      style={{ top, left }}
    >
      {title && <div className={cx('title')}>{title}</div>}
      <div className={cx('content')}>{children}</div>
    </div>
  );
};

Popover.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  trianglePosition: PropTypes.shape({
    side: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
    position: PropTypes.oneOf(['left', 'middle', 'right']),
  }),
  dataAutomationId: PropTypes.string,
  onClose: PropTypes.func,
  parentRef: PropTypes.shape({ current: PropTypes.object }),
};

Popover.defaultProps = {
  children: null,
  title: '',
  trianglePosition: {
    side: 'top',
    position: 'left',
  },
  dataAutomationId: '',
  onClose: () => {},
  parentRef: null,
};
