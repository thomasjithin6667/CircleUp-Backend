import { Request, Response } from 'express';
import Interview from "../models/interview/interviewModel";

// Controller function to add an interview
export const addInterview = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      interviewerId,
      intervieweeId,
      applicationId,
      jobId,
      jury,
      interviewDate,
      interviewTime,
      interviewLink,
      status = 'Pending',
    } = req.body;

    const newInterview = new Interview({
      interviewerId,
      intervieweeId,
      applicationId,
      jobId,
      jury,
      interviewDate,
      interviewTime,
      interviewLink,
      status,
    });

    const savedInterview = await newInterview.save();

    res.status(201).json({ message: 'Interview scheduled successfully', interview: savedInterview });
  } catch (error) {
    console.error('Error adding interview:', error);
    res.status(500).json({ message: 'Error adding interview' });
  }
};



// Controller function to edit an interview
export const editInterview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.body; 
    const {

      jury,
      interviewDate,
      interviewTime,
      status,
    } = req.body;

    const existingInterview = await Interview.findById(id);
    if (!existingInterview) {
      res.status(404).json({ message: 'Interview not found' });
      return;
    }

    existingInterview.jury = jury;
    existingInterview.interviewDate = interviewDate;
    existingInterview.interviewTime = interviewTime;
    existingInterview.status = status || existingInterview.status;

    const updatedInterview = await existingInterview.save();

    res.status(200).json({ message: 'Interview updated successfully', interview: updatedInterview });
  } catch (error) {
    console.error('Error editing interview:', error);
    res.status(500).json({ message: 'Error editing interview' });
  }
};


// Controller function to change the status of an interview
export const setInterviewStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params; 
      const { status } = req.body;
  

      const existingInterview = await Interview.findById(id);
      if (!existingInterview) {
        res.status(404).json({ message: 'Interview not found' });
        return;
      }

      existingInterview.status = status;
  
      const updatedInterview = await existingInterview.save();
  
      res.status(200).json({ message: 'Interview status updated successfully', interview: updatedInterview });
    } catch (error) {
      console.error('Error changing interview status:', error);
      res.status(500).json({ message: 'Error changing interview status' });
    }
  };