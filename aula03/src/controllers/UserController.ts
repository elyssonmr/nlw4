import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repository/UserRespository";


class UserController {
  async create(request: Request, response: Response) {
    const { name, email } = request.body;
    const usersRepository = getCustomRepository(UsersRepository);

    const userAlreadyExists = await usersRepository.findOne({ email });
    if(userAlreadyExists) {
      return response.status(400).json({
        error: "User Already Exists"
      })
    }
    const user = usersRepository.create({
      name: name,
      email: email
    });

    await usersRepository.save(user);

    return response.status(201).json(user);
  }
}

export { UserController }
