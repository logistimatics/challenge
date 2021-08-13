import React from 'react';
import { Button } from 'reactstrap';
import './LoaderButton.css';

export default ({ isLoading, text, loadingText, disabled = false, ...props }) => (
  <Button disabled={disabled || isLoading} {...props}>
    {isLoading && <i className="fa fa-refresh spinning" aria-hidden="true"></i>}
    {!isLoading ? text : loadingText}
  </Button>
);
