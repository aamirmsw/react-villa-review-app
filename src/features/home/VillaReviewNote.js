import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import withStyles from '@material-ui/core/styles/withStyles';
import styles from './styles/villaNoteStyle';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import VillaReview from './VillaReview';

export class VillaReviewNote extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };


  constructor(props) {
    super(props);
    this.state = {};
  }


  render() {
    const { classes, home = {} } = this.props;
    const { villaReview } = home;
    const { surroundingArea = {}, villaDecor = {}, constructionQuality = {} } = villaReview;

    return (
      <div className={classes.root}>
        <div className={classes.villaReviewContainer}>
          <Paper elevation={3} classes={{ root: classes.paperRoot }}>
            <Typography variant="h4" component="h4" gutterBottom>
              Villa Review
            </Typography>
            <Typography variant="h6" component="h6" classes={{ root: classes.title }}>
              Name of the villa
            </Typography>
            <Typography variant="subtitle1" gutterBottom classes={{ root: classes.subTitle }}>
              {villaReview.villaName}
            </Typography>


            <Typography variant="h6" component="h6" classes={{ root: classes.title }}>
              Date of visit
            </Typography>
            <Typography variant="subtitle1" gutterBottom classes={{ root: classes.subTitle }}>
              {villaReview.visitDate}
            </Typography>

            <Typography variant="h6" component="h6" classes={{ root: classes.title }}>
              Pincode
            </Typography>
            <Typography variant="subtitle1" gutterBottom classes={{ root: classes.subTitle }}>
              {villaReview.pinCode}
            </Typography>

            <Typography variant="h6" component="h6" classes={{ root: classes.title }}>
              Owner's name
            </Typography>
            <Typography variant="subtitle1" gutterBottom classes={{ root: classes.subTitle }}>
              {villaReview.ownerName}
            </Typography>


            <VillaReview dataSource={surroundingArea} title={'A note about the surrounding area of the villa'}
                         review={surroundingArea.review} onSelect={(data) => {
              this.onReviewSelect(data, 'surroundingArea');
            }}/>

            <VillaReview dataSource={constructionQuality} title={'A note about the construction quality of the villa'}
                         review={constructionQuality.review} onSelect={(data) => {
              this.onReviewSelect(data, 'constructionQuality');
            }}/>

            <VillaReview dataSource={villaDecor} title={'A note about the villa decor'} review={villaDecor.review}
                         onSelect={(data) => {
                           this.onReviewSelect(data, 'villaDecor');
                         }}/>


            <Button variant="contained"
                    color="secondary"
                    onClick={() => {
                      this.onSave(null);
                    }}>
              Delete All
            </Button>

          </Paper>
        </div>
      </div>

    );
  }

  onSave(data) {
    const { saveVillaReview } = this.props.actions;
    saveVillaReview(data);
  }

  onReviewSelect(data, key) {
    const { saveVillaReview } = this.props.actions;
    const { home = {} } = this.props;
    const { villaReview } = home;
    const selectionData = { ...villaReview[key] };
    console.log(selectionData);
    if (selectionData['highlightedReview'] && selectionData['highlightedReview'].length > 0) {
      selectionData['highlightedReview'].push(data);
    } else {
      selectionData['highlightedReview'] = [];
      selectionData['highlightedReview'].push(data);
    }

    villaReview[key] = selectionData;
    console.log(villaReview);
    saveVillaReview(villaReview);
  }
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
)(withStyles(styles)(VillaReviewNote));
