import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repository/UserRespository";
import * as yup from "yup";
import { AppError } from "../errors/AppError";


class UserController {
  async create(request: Request, response: Response) {
    const { name, email } = request.body;
    const schema = yup.object().shape({
      name: yup.string().required("Name is required"),
      email: yup.string().email("Email should be a valid email").required("Email is required")
    })

    try {
      await schema.validate(request.body, {abortEarly: false})
    } catch(err) {
      throw new AppError("Validation Error", 400, err.errors)
    }
    const usersRepository = getCustomRepository(UsersRepository);

    const userAlreadyExists = await usersRepository.findOne({ email });
    if(userAlreadyExists) {
      throw new AppError("User Already Exists");
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
