import { Request, Response } from "express";
import { getCustomRepository, IsNull, Not } from "typeorm";
import { SurveysUsersRepository } from "../repository/SurveysUsersRepository";

class NPSController {
  async calculate(request: Request, response: Response) {
    const { survey_id } = request.params;
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveysUsers = await surveysUsersRepository.find({
      survey_id
    });

    const totalAnswers = surveysUsers.filter(
      survey => survey.value !== null
    ).length;

    const notAnswered = surveysUsers.filter(
      survey => survey.value == null
    ).length

    const detractors = surveysUsers.filter(
      survey => survey.value !== null && survey.value >= 0 && survey.value <= 6
    ).length;

    const promoters = surveysUsers.filter(
      survey => survey.value >= 9 && survey.value <= 10
    ).length;

    const passives = surveysUsers.filter(
      survey => survey.value >= 7 && survey.value <= 8
    ).length;

    const nps = ((promoters - detractors) / totalAnswers) * 100;

    return response.json({
      detractors,
      passives,
      promoters,
      totalAnswers,
      notAnswered,
      nps: Number(nps.toFixed(2))
    })
  }
}

export { NPSController }
