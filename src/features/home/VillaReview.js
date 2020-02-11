import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import withStyles from '@material-ui/core/styles/withStyles';
import styles from './styles/villaReviewStyle';
import Button from '@material-ui/core/Button';
import Popover from 'react-text-selection-popover';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { findAll } from 'highlight-words-core';
import EditIcon from '@material-ui/icons/Edit';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';

export class VillaReview extends PureComponent {


  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      selectedString: '',
      openCommentDialog: false,
      comments: '',
      isCommentDisabled: false,

    };
    this.ref = React.createRef();
  }

  render() {
    const { classes, title, review, dataSource } = this.props;
    const { highlightedReview = [] } = dataSource;

    const autoEscape = true;
    const textToHighlight = review;
    const searchWords = highlightedReview && highlightedReview.length > 0 ? highlightedReview.map(item => {
      return item['highlightedReview'];
    }) : [];
    const chunks = findAll({
      autoEscape,
      searchWords,
      textToHighlight,
    });
    const { selectedString, openCommentDialog, comments = '', isCommentDisabled } = this.state;

    return (
      <div className="v-box">
        <Paper className={classes.reviewWrapper}>
          <Typography variant="h6" component="h6" classes={{ root: classes.title }}>
            {title}
          </Typography>
          <Typography variant="subtitle1" ref={this.ref} gutterBottom classes={{ root: classes.subTitle }}>
            {
              (
                <div>
                  {chunks.map((chunk, index) => {
                    const text = textToHighlight.substr(chunk.start, chunk.end - chunk.start);

                    return !chunk.highlight ? (
                      text
                    ) : (
                      <span onClick={() => {
                        this.onHighlightedClick(text, searchWords);
                      }}
                            key={index}
                            style={chunk.highlight && { backgroundColor: '#ffff00',cursor:'pointer' }}>
                          {text}
                      </span>
                    );
                  })}
                </div>
              )
            }
          </Typography>

          {

            (!highlightedReview || highlightedReview.length !== 3) &&
            (
              <Popover isOpen={this.state.isOpen} selectionRef={this.ref} onTextSelect={() => {
                this.setState({ isOpen: true });
                this.setState({ selectedString: window.getSelection().toString() });
              }}>

                <div className={classes.editHover} onClick={() => {
                  if (selectedString.trim().length > 0) {
                    this.setState({ isOpen: false, openCommentDialog: true });
                  }
                }
                }><EditIcon style={{ color: '#fff' }}/></div>
              </Popover>
            )
          }
        </Paper>

        <Dialog fullWidth={true} onClose={this.handleClose} aria-labelledby="customized-dialog-title"
                open={openCommentDialog}>
          <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
            Review
          </DialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom>
              { !isCommentDisabled ? 'Write comment' : 'Comment'}
            </Typography>

            <div className={classes.inputFieldWrapper}>
              {
                !isCommentDisabled &&
                <TextField
                  className={classes.inputField}
                  name={'comments'} label="COMMENT" variant="outlined"
                  value={comments}
                  multiline={true}
                  disabled={isCommentDisabled}
                  rows={6}
                  onChange={(e) => this.updateReviewField(e)}/>
              }

              {
                isCommentDisabled &&
                <Typography gutterBottom>
                  {comments}
                </Typography>
              }

            </div>

          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={() => {
              !isCommentDisabled ? this.onCommentSave(comments) : this.handleClose();
            }} color="primary">
              {!isCommentDisabled ? 'Save changes' : 'Close'}
            </Button>
          </DialogActions>
        </Dialog>

      </div>
    );
  }

  updateReviewField(e) {
    this.setState({ comments: e.target.value });
  }

  onCommentSave() {
    const { selectedString, comments } = this.state;
    if (comments.trim().length === 0) {
      alert('Please write a comment');
      return;
    }
    const { onSelect } = this.props;
    const reviewPayload = {
      highlightedReview: selectedString,
      comments,
    };
    onSelect && onSelect(reviewPayload);
    this.handleClose();
  }

  onHighlightedClick(text, data) {
    const { highlightedReview = [] } = this.props.dataSource;
    let itemIndex = data.indexOf(text);
    if (itemIndex !== -1) {
      this.setState({
        openCommentDialog: true,
        comments: highlightedReview[itemIndex].comments,
        isCommentDisabled: true,
      });
    }
  }

  handleClose = () => {
    this.setState({ openCommentDialog: false, comments: '', isOpen: false, isCommentDisabled: false });
  };
}

function mapStateToProps(state) {
  return {
    home: state.home,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(VillaReview));
