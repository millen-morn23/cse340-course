import {
  addVolunteer,
  removeVolunteer
} from '../models/volunteers.js';

// Add volunteer controller
const processVolunteer =
  async (req, res) => {

    const userId =
      req.session.user.user_id;

    const {
      projectId
    } = req.params;

    try {

      await addVolunteer(
        userId,
        projectId
      );

      req.flash(
        'success',
        'You are now volunteering for this project.'
      );

      res.redirect(
        `/project/${projectId}`
      );

    } catch (error) {

      console.error(
        'Volunteer error:',
        error
      );

      req.flash(
        'error',
        'Unable to volunteer for project.'
      );

      res.redirect(
        `/project/${projectId}`
      );
    }
};

// Remove volunteer controller
const processRemoveVolunteer =
  async (req, res) => {

    const userId =
      req.session.user.user_id;

    const {
      projectId
    } = req.params;

    try {

      await removeVolunteer(
        userId,
        projectId
      );

      req.flash(
        'success',
        'You are no longer volunteering for this project.'
      );

      res.redirect(
        `/project/${projectId}`
      );

    } catch (error) {

      console.error(
        'Remove volunteer error:',
        error
      );

      req.flash(
        'error',
        'Unable to remove volunteer.'
      );

      res.redirect(
        `/project/${projectId}`
      );
    }
};

export {
  processVolunteer,
  processRemoveVolunteer
};