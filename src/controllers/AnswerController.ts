import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysUsersRepository } from "../repository/SurveysUsersRepository";

class AnswerController {
  async execute(request: Request, response: Response) {
    const { value } = request.params;
    const { u } = request.query;

    const surveyUserRepository = getCustomRepository(SurveysUsersRepository);

    const surveyUser = await surveyUserRepository.findOne({
      id: String(u)
    });

    if(!surveyUser) {
      throw new AppError("Survey does not exist.");
    }

    surveyUser.value = Number(value);
    await surveyUserRepository.save(surveyUser);

    return response.json(surveyUser);
  }
}

export { AnswerController }
