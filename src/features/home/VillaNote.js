import React, { Component, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import withStyles from '@material-ui/core/styles/withStyles';
import styles from './styles/villaNoteStyle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DateFnsUtils from '@date-io/date-fns';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import Paper from '@material-ui/core/Paper';
import VillaReviewNote from './VillaReviewNote';


export class VillaNote extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }


  render() {
    const { classes, home = {} } = this.props;
    const { villaReview } = home;
    if (villaReview) {
      return <VillaReviewNote/>;
    }
    return (
      <div className={classes.root}>
        <ReviewForm onSave={(data) => {
          this.onSave(data);
        }} classes={classes}/>
      </div>
    );
  }

  onSave(data) {
    const { saveVillaReview } = this.props.actions;
    const {
      villaName = '',
      pinCode = '',
      surroundingArea = {},
      constructionQuality = {},
      villaDecor = {},
      visitDate = '',
    } = data;

    if (!villaName || villaName.trim().length === 0) {
      alert('Please provide villa name');
      return;
    }

    if (!visitDate) {
      alert('Please provide date of visit');
      return;
    }

    if (!pinCode || pinCode.trim().length === 0) {
      alert('Please provide pincode');
      return;
    }

    if (!surroundingArea || !surroundingArea.review || surroundingArea.review.trim().length === 0) {
      alert('Please provide note about surrounding area');
      return;
    }

    if (!constructionQuality || !constructionQuality.review || constructionQuality.review.trim().length === 0) {
      alert('Please provide note about construction quality');
      return;
    }

    if (!villaDecor || !villaDecor.review || villaDecor.review.trim().length === 0) {
      alert('Please provide note about villa decor');
      return;
    }

    saveVillaReview(data);
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
)(withStyles(styles)(VillaNote));


const ReviewForm = ({ onSave, classes }) => {
  const [form, setState] = useState(
    {
      villaName: '',
      pinCode: '',
      ownerName: '',
      surroundingArea: {},
      constructionQuality: {},
      villaDecor: {},
      visitDate: new Date(),
    });

  const handleDateChange = date => {
    setState({ ...form, visitDate: date });
  };

  const updateField = e => {
    setState({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const updateReviewField = (e, key) => {
    const inputObject = { ...form[e.target.name] };
    inputObject[key] = e.target.value;
    setState({
      ...form,
      [e.target.name]: inputObject,
    });
  };


  return (
    <div className={classes.root}>
      <div className={classes.villaReviewContainer}>
        <h3>{`Villa Review`}</h3>
        <Paper elevation={3} classes={{ root: classes.paperRoot }}>
          <div className={classes.inputFieldWrapper}>
            <TextField
              className={classes.inputField}
              name={'villaName'} label="Villa Name" variant="outlined"
              value={form.villaName}
              onChange={updateField}/>
          </div>

          <div className={classes.inputFieldWrapper}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                className={classes.inputField}
                margin="normal"
                variant="outlined"
                id="date-picker-dialog"
                label="Date of visit"
                name={'visitDate'}
                format="MM/dd/yyyy"
                value={form.visitDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
          </div>


          <div className={classes.inputFieldWrapper}>
            <TextField
              className={classes.inputField}
              type={'number'}
              name={'pinCode'} label="Pincode" variant="outlined"
              value={form.pinCode}
              rows={5}
              onChange={updateField}/>
          </div>


          <div className={classes.inputFieldWrapper}>
            <TextField
              className={classes.inputField}
              name={'ownerName'} label="Owner's name (optional)" variant="outlined"
              value={form.ownerName}
              onChange={updateField}/>
          </div>

          <div className={classes.inputFieldWrapper}>
            <TextField
              className={classes.inputField}
              name={'surroundingArea'} label="A note about the surrounding area of the villa" variant="outlined"
              value={form.surroundingArea.review}
              multiline={true}
              rows={6}
              onChange={(e) => updateReviewField(e, 'review')}/>
          </div>

          <div className={classes.inputFieldWrapper}>
            <TextField
              className={classes.inputField}
              name={'constructionQuality'} label="A note about the construction quality of the villa" variant="outlined"
              value={form.constructionQuality.review}
              multiline={true}
              rows={6}
              onChange={(e) => updateReviewField(e, 'review')}/>
          </div>

          <div className={classes.inputFieldWrapper}>
            <TextField
              className={classes.inputField}
              name={'villaDecor'} label="A note about the villa decor" variant="outlined"
              value={form.villaDecor.review}
              multiline={true}
              rows={6}
              onChange={(e) => updateReviewField(e, 'review')}/>
          </div>

          <Button variant="contained"
                  color="primary"
                  onClick={() => {
                    onSave(form);
                  }}>
            Save
          </Button>
        </Paper>
      </div>
    </div>
  );
};