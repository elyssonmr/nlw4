import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repository/SurveysRepository";
import { SurveysUsersRepository } from "../repository/SurveysUsersRepository";
import { UsersRepository } from "../repository/UserRespository";
import SendMailService from "../services/SendMailService";
import { resolve } from "path";
import { AppError } from "../errors/AppError";


class SendMailController {
  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body
    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const user = await usersRepository.findOne({email});

    if(!user) {
      throw new AppError("User does not exist.");
    }

    const survey = await surveysRepository.findOne({id: survey_id});

    if(!survey) {
      throw new AppError("Survey does not exist");
    }

    let surveyUser = await surveysUsersRepository.findOne({
      where: {user_id: user.id, survey_id: survey.id, value: null},
      relations: ["user", "survey"]
    });

    if(!surveyUser) {
      surveyUser = surveysUsersRepository.create({
        user_id: user.id,
        survey_id: survey_id
      });
      await surveysUsersRepository.save(surveyUser);
    }

    const path = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");
    const variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      survey_user_id: surveyUser.id,
      link: process.env.URL_MAIL
    }
    await SendMailService.execute(email, survey.title, variables, path);

    return response.json(surveyUser);
  }
}

export { SendMailController }
