
import React from 'react';



import { Text } from '../reactComponents/Text';
import { Icon } from '../reactComponents/Icon';
import { StartCreatingButton } from '../reactComponents/StartCreatingButton';
import { Screen } from '../reactComponents/Screen';
import { Card } from '../reactComponents/Card';
import { IconButton } from '../reactComponents/IconButton';
import { SubText } from '../reactComponents/SubText';





interface ComponentProps {
    Text?: React.FC;
    IconComponent?: React.FC;
    StartCreatingButton?: React.FC;
    Screen?: React.ReactNode;
    Card?: React.ReactNode;
    IconButton?: React.FC;
    SubText?: React.FC;
}


export const Component: React.FC<ComponentProps> = ({}) => {

    return(
        <Screen>
            <Card>
                <Icon />
                <Text/>
                <SubText />
                <StartCreatingButton />
                <IconButton />
            </Card>
        </Screen>
    );

}
