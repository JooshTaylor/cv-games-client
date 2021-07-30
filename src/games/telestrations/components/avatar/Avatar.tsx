import React from 'react';
import { Account } from '../../../../shared/interfaces/Account';

interface AvatarProps {
  player: Account;
}

export function Avatar(props: AvatarProps): JSX.Element {
  return (
    <div className='d-flex flex-column align-items-center'>
      <img alt={props.player.username} src={props.player.imageUrl} className='avatar' />
      <div>{props.player.username}</div>
    </div>
  );
}