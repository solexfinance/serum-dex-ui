import { createGlobalStyle } from 'styled-components';

// #161a1e global bg
// #22930 border
// #161a1e header bg

export const GlobalStyle = createGlobalStyle`
html,body{
  background: #161a1e;
}
input[type=number]::-webkit-inner-spin-button {
  opacity: 0;
}
input[type=number]:hover::-webkit-inner-spin-button,
input[type=number]:focus::-webkit-inner-spin-button {
  opacity: 0.25;
}
/* width */
::-webkit-scrollbar {
  width: 15px;
}
/* Track */
::-webkit-scrollbar-track {
  background: #2d313c;
}
/* Handle */
::-webkit-scrollbar-thumb {
  background: #5b5f67;
}
/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #5b5f67;
}
.ant-slider-track, .ant-slider:hover .ant-slider-track {
  background-color: #00fdbb;
  opacity: 0.75;
}
.ant-slider-track,
.ant-slider ant-slider-track:hover {
  background-color: #00fdbb;
  opacity: 0.75;
}
.ant-slider-dot-active,
.ant-slider-handle,
.ant-slider-handle-click-focused,
.ant-slider:hover .ant-slider-handle:not(.ant-tooltip-open)  {
  border: 2px solid #00fdbb; 
}
.ant-table-tbody > tr.ant-table-row:hover > td {
  background: #273043;
}
.ant-table-tbody > tr > td {
  border-bottom: 8px solid #161a1e;
}
.ant-table-container table > thead > tr:first-child th {
  border-bottom: none;
}
.ant-divider-horizontal.ant-divider-with-text::before, .ant-divider-horizontal.ant-divider-with-text::after {
  border-top: 1px solid #434a59 !important;
}
.ant-layout {
    background: #161a1e;
  }
  .ant-table {
    background: #1e2026;
  }
  .ant-table-tbody > tr.ant-table-placeholder:hover > td {
    background: #111417;
  } 
  .ant-table-thead > tr > th {
    background: #161a1e;
  }
.ant-select-item-option-content {
  img {
    margin-right: 4px;
  }
}
.ant-modal-content {
  background-color: #1e2026;
}

@-webkit-keyframes highlight {
  from { background-color: #00fdbb;}
  to {background-color: #161a1e;}
}
@-moz-keyframes highlight {
  from { background-color: #00fdbb;}
  to {background-color: #161a1e;}
}
@-keyframes highlight {
  from { background-color: #00fdbb;}
  to {background-color: #161a1e;}
}
.flash {
  -moz-animation: highlight 0.5s ease 0s 1 alternate ;
  -webkit-animation: highlight 0.5s ease 0s 1 alternate;
  animation: highlight 0.5s ease 0s 1 alternate;
}`;
