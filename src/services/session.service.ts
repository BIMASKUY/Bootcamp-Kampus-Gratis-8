import { ISession, Session } from '../models/session.model';

export const storeSession = async (token: string) : Promise<boolean> => { 
    const status: string = 'valid';
    const expiresAt: Date = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expires
    const session: ISession = await Session.create({
      token, 
      status,
      expiresAt
    })
    return !!session;
  }
  
export const invalidSession = async (token: string) : Promise<boolean> => {
  const updateSession = await Session.updateOne(
        { 
          token: token 
        },
        {
          $set: {
            status: 'expired'
          }
        },
        { 
          runValidators: true 
        }
    );

    return updateSession.modifiedCount > 0;
}

export const getSession = async (token: string) : Promise<ISession | null> => {
    const session: ISession | null = await Session.findOne(
        {
            token: token
        },
        {}, //Select all fields
        {
            runValidators: true
        }
    )

    return session;
}