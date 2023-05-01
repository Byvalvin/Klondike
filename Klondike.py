#AUTHOR: Daniel Asimiakwini


# CLASS DEFINITIONS
def main():
    """
    main function call.

    Parameters
    ----------
    None
       

    Returns
    -------
    None
    
    """
    game = Game()
    alt_rule = False # To change game rule(s) False->No alt_rule

    try:
        game.play(alt_rule)
    except AssertionError as no_dice:
        print(no_dice)

class Card:
    '''
    The Card object, like a real card.

    Parameters
    ----------
    suit : str
       A string denoting the card's suit.

    rank : str
       A string denoting the card's rank.
       

    Attributes
    ----------
    suit : str
       A string denoting the card's suit.

    rank : str
       A string denoting the card's rank.
       
    visible : boolean
       determines if the card is face up or face down.
       

    Returns
    -------
    Card
       A card object.
       
    '''

    def __init__(self,suit,rank):
        """
        Card class initilizer function
        
        
        Parameters
        ----------
        suit : str
            A string denoting the card's suit.

        rank : str
            A string denoting the card's rank.
    
        Returns
        -------
        none

        """
        self.__suit = suit.lower()
        self.__rank = rank
        self.__visible = True


    def rankCard(self):
        """
        Returns the card's rank.
    
        Parameters
        ----------
        None
    
    
        Returns
        -------
        card's rank
    
        """    

        King = "K"
        Queen = "Q"
        Jack = "J"
        Ten = "T"
        Ace = "A"

        ranking = {King:13,Queen:12,Jack:11,Ten:10,"9":9,"8":8,"7":7,"6":6,"5":5,"4":4,"3":3,"2":2,"1":1,Ace:1}
        return ranking[self.__rank]

        
    def suitCard(self):
        """
        Returns the card's suit.
    
        Parameters
        ----------
        None

    
        Returns
        -------
        card's suit
    
        """

        if self.__suit == "s":
            suit = "Spades"
        elif self.__suit == "h":
            suit = "Hearts"
        elif self.__suit == "d":
            suit = "Diamonds"
        elif self.__suit == "c":
            suit = "Clubs"

        return suit


    def faceupCard(self,visible):
        """
        flips card. 
    
        Parameters
        ----------
        visible : bool
            to face the card up/True or down/False
    

        Returns
        -------
        None
    
        """ 
        self.__visible = visible
        

    def __str__(self):
        """
        returns card's basic string representation 
    
        Parameters
        ----------
        None
    
    
        Returns
        -------
        string representation
    
        """ 
        card = str(self.__rank)+str(self.__suit)

        if not self.__visible:
            card = "??"
     
        return card


    def __repr__(self):
        """
        returns card's detailed string representation 
    
        Parameters
        ----------
        None
    
    
        Returns
        -------
        string representation
    
        """ 
        up = "+"
        down = "-"
        rep = str(self.__rank)+str(self.__suit)
        
        if self.__visible:
            rep += up
            
        else:
            rep += down

        return rep
#________________________________________________________________________________________________________________________________

class Deck:
    '''
    The Deck object, like a real deck.

    Parameters
    ----------
    name : str
       A string denoting the card's suit.

    Attributes
    ----------
    name : str
       A string denoting the card's suit.

    cards : list
       used a list to implement the DEck.
       
    size : int
       number of objects in Deck.
       

    Returns
    -------
    Deck
       A deck
        object.
       
    '''
    def __init__(self, name):
        """
        Deck class initilizer function
        
        
        Parameters
        ----------
        name : str
            A string denoting the card's suit.


        Returns
        -------
        none

        """
        self.__cards = []
        self.__name = name
        self.__size = len(self.__cards)
        

    def nameDeck(self):
        """
        Returns the deck's name.
    
        Parameters
        ----------
        None
    
    
        Returns
        -------
        deck's name
    
        """  
        return self.__name

    def sizeDeck(self):
        """
        Returns the deck's size.
    
        Parameters
        ----------
        None
    
    
        Returns
        -------
        deck's size
    
        """  
        return self.__size

    def isemptyDeck(self):
        """
        Returns boolean for if deck is empty.
    
        Parameters
        ----------
        None
    
    
        Returns
        -------
        boolean for if deck is empty(True) or not(Flase)
    
        """  
        return self.sizeDeck() == 0

    def peekDeck(self):
        """
        Returns the top card on the deck without removing it.
    
        Parameters
        ----------
        None
    
    
        Returns
        -------
        card
    
        """  
        return self.__cards[len(self.__cards)-1]

    def pushDeck(self,card):
        """
        Add a card to the deck.
    
        Parameters
        ----------
        card : Card
            Card object to be added to deck

    
    
        Returns
        -------
        none
    
        """  
        assert type(card)==Card, "%s is not a Card"%card

        self.__cards.append(card)
        self.__size+=1

    def popDeck(self):
        """
        Returns the top card on the deck,removes it.
    
        Parameters
        ----------
        None
    
    
        Returns
        -------
        card
    
        """  
        self.__size-=1
        return self.__cards.pop()


    def __str__(self):
        """
        returns deck's basic string representation 
    
        Parameters
        ----------
        None
    
    
        Returns
        -------
        string representation
    
        """ 
        deck = " [ "
        for card_n in range(self.sizeDeck()-1,-1,-1):
            deck += str(self.__cards[card_n])+" "
        deck+="]"
        return deck

    def __repr__(self):
        """
        returns deck's detailed string representation 
    
        Parameters
        ----------
        None
    
    
        Returns
        -------
        string representation
    
        """ 
        rep = " [ "
        for card_n in range(self.sizeDeck()-1,-1,-1):
            rep += repr(self.__cards[card_n])+" "
        rep+="]"
        return rep
#________________________________________________________________________________________________________________________________

# Game play stuff
class Game:
    '''
    A Klondike game.

    Parameters
    ----------
    None.
       

    Attributes
    ----------
    
    start_message : str
       game start message.
       
    end_message : str
       game end message.
       
    game_on : boolean
       determines if game is still being played.

    Stock : Deck
       determines if Mini_Beartracks will show options after each user action.
       
    Discard : Deck
       discard deck.
       
    SUITS : list
       list of decks for suits.

    PILES : list
       list of decks for the piles.
       
    Decks : list
       list of objects needed to make/display the board.
       
    game : str
       The filename of the game being played.
       

    Returns
    -------
    Game
       Klondike game session.
       
    '''
    def __init__(self):
        """
        Game class initilizer function
        
        
        Parameters
        ----------
        None.


        Returns
        -------
        none

        """
        self.start_message = "Welcome to Klondike!"
        self.end_message = "Thank you for playing"
        self.game_on = True
        self.Stock = None
        self.Discard = None
        self.SUITS = [None]
        self.PILES = [None]
        self.Decks = [self.Stock,self.Discard,self.SUITS,self.PILES]
        self.game = None
    #________________________________________________________________________________________________________________________________

    def regular(self,user_input):
        """
        to play a regular game(no alternate rule)
        
        
        Parameters
        ----------
        user_input : str
            The user's input.


        Returns
        -------
        none

        """
        user_input_list=user_input.split()

        command_list = [None,None,None]
        commands = []
        max_commands = len(command_list)

        for n in range(len(user_input_list)):
            command = user_input_list[n]
            if n<max_commands:
                command_list[n]=user_input_list[n].strip()
            if user_input_list[n] != None:
                a_file = user_input_list[n][len(user_input_list[n])-4:]== ".txt"
            if not a_file:
                command = user_input_list[n].lower()
            commands.append(command)
            

                

        print("Executing:",commands)
        
        # COMMANDings
        command1=command_list[0]
        command2=command_list[1]
        command3=command_list[2]

        all_commands = ["load","board","cheat","comment","reset","discard","save","done","move"]

        try:
            if command1 == None or command1.lower() not in all_commands:
                raise CommandError(command1)

        except CommandError as bad_command:
            print(bad_command)


        # DONE
        if command1.lower() == "board":
            try:
                if self.game == None:
                    raise GameError(command1.lower())
                else:
                    filled = True
                    for deck_related_object in self.Decks:
                        if deck_related_object == None:
                            filled = False

                    if filled:
                        board(self.Stock,self.Discard,self.SUITS,self.PILES)
                    else:
                        print("No Cards")
            except GameError as gerror:
                print(gerror)

        # DONE
        elif command1.lower() == "cheat":

            #same as board
            try:
                if self.game == None:
                    raise GameError(command1.lower())
                else:
                    filled = True
                    for deck_related_object in self.Decks:
                        if deck_related_object == None:
                            filled = False

                    if filled:
                        cheat(self.Stock,self.Discard,self.SUITS,self.PILES)
                    else:
                        print("No Cards")
            except GameError as gerror:
                print(gerror)

        # DONE
        elif command1.lower() == "comment":
            comment_text(commands)

        # DONE
        elif command1.lower() == "load":
            start_filename = command2
            try:
                Decks = load(start_filename)
                self.SUITS = []
                self.PILES = []
                
                # update all decks
                try:
                    for deck_index in range(len(Decks)):
                        stock = Decks[deck_index].nameDeck()=="Stock"
                        discarded = Decks[deck_index].nameDeck()=="Discard"
                        pile = "pile" in Decks[deck_index].nameDeck().lower()

                        if stock:
                            self.Stock = Decks[deck_index]
                        elif discarded:
                            self.Discard = Decks[deck_index]
                        elif pile:
                            self.PILES.append(Decks[deck_index])
                        else:
                            self.SUITS.append(Decks[deck_index])

                    self.game = start_filename

                    self.SUITS.sort(key=by_name,reverse=True)
                    self.PILES.sort(key=by_name)
                    self.Decks = [self.Stock,self.Discard,self.SUITS,self.PILES]

                except Exception as anyerror:
                    raise FileError(command1)
                

            except NotFoundError as nofile:
                print(nofile)

            except FileError as badfile:
                print(badfile)


        elif command1.lower() == "save":
            try:
                game_filename = command2.strip()
                save(game_filename,self.Decks)

            except GameError as gerror:
                print(gerror)

        elif command1.lower() == "discard":
            try:
                if self.game==None:
                    raise GameError(command1.lower())
                else:
                    try:
                        if self.Stock.isemptyDeck():
                            raise DiscardError(command1)
                        else:
                            discard(self.Stock,self.Discard)

                    except DiscardError as OutOfStock:
                        print(OutOfStock)

            except GameError as gerror:
                print(gerror)

        elif command1.lower() == "move":
            try:
                if self.game==None:
                    raise GameError(command1.lower())

                else:
                    FromDeck = None
                    ToDeck = None
                    

                    Pile_numbers = ["1","2","3","4","5","6","7"]
                    options = ["stock","suit"] + Pile_numbers
                

                    try:
                        if  command2!=None and command2.lower() not in options  or command3!=None and command3.lower() not in options:
                            raise ArgumentError(command1)

                        elif command2 == None or command3 == None:
                            raise InsufficientArgumentError(command1)
                        else:
                            stock = command2.lower() == options[0]
                            suit = command3.lower() == options[1]
                            frompile = command2.lower() in Pile_numbers 
                            topile = command3.lower() in Pile_numbers
                            pile_to_pile = frompile and topile
                            
                            # STOCK TO SUIT, didnt change with alt rule
                            if stock and suit:
                                try:
                                    Suit = self.Stock.peekDeck().suitCard()
                                    if Suit == "Spades":
                                        SuitDeck = self.SUITS[0]
                                    elif Suit == "Hearts":
                                        SuitDeck = self.SUITS[1]
                                    elif Suit == "Diamonds":
                                        SuitDeck = self.SUITS[2]
                                    elif Suit == "Clubs":
                                        SuitDeck = self.SUITS[3]
                                except Exception:
                                    print("Stock Empty")

                                FromDeck = self.Stock
                                ToDeck = SuitDeck
                                

                            # STOCK TO PILE NUMBER, ALT CHANGED
                            elif stock and topile:
                                # STOCK MUST NOT BE EMPTY, 1 card at a time
    

                                for pile in self.PILES:
                                    if command3 in pile.nameDeck():
                                        Pile = pile

                    
                                
                                FromDeck = self.Stock
                                ToDeck = Pile

                            # PILE NUMBER TO SUIT, not affected by alt
                            elif frompile and suit:
                                # from Pile MUST NOT BE EMPTY
                                for pile in self.PILES:
                                    if command2 in pile.nameDeck():
                                        Pile = pile
                                try:
                                    Suit = Pile.peekDeck().suitCard()
                                    if Suit == "Spades":
                                        SuitDeck = self.SUITS[0]
                                    elif Suit == "Hearts":
                                        SuitDeck = self.SUITS[1]
                                    elif Suit == "Diamonds":
                                        SuitDeck = self.SUITS[2]
                                    elif Suit == "Clubs":
                                        SuitDeck = self.SUITS[3]
                                except Exception:
                                    raise MoveError(command1)
                                    
                                FromDeck = Pile
                                ToDeck = SuitDeck

                            # PILE NUMBER TO PILE NUMBER, CHANGED BY ALT(This regular though)
                            elif pile_to_pile:
                                
                                # from Pile MUST NOT BE EMPTY,ANY LENGTH AT A TIME(relaytime), also need to compare hiddens!

                                relay = Deck("relayDeck")
                            

                                for pile in self.PILES:
                                    if command2 in pile.nameDeck():
                                        Pile1 = pile
                                    if command3 in pile.nameDeck():
                                        Pile2 = pile               

                                
                                FromDeck = Pile1
                                ToDeck = Pile2                       

                            else:
                                print("no match")


                    except InsufficientArgumentError as need_args:
                        print(need_args)

                    except ArgumentError as bad_argument:
                        print(bad_argument)

                    except MoveError as mustmix:
                        print(mustmix)

                    else:
                        try:
                            move(FromDeck,ToDeck)

                        except MoveError as bad_move:
                            
                            print(bad_move)
                        except AssertionError as ae:
                            print(ae)
                            
                            
                    
            except GameError as gerror:
                
                print(gerror)

                

        # DONE
        elif command1.lower() == "reset":
            try:
                if self.game == None:
                    raise GameError(command1.lower())
                else:
                    try:
                        if not self.Stock.isemptyDeck():
                            raise ResetError(command1)
                        else:
                            reset(self.Stock,self.Discard)
                    except ResetError as NoReset:
                        print(NoReset)

            except GameError as gerror:
                print(gerror)

        # DONE
        elif command1.lower() == "done":
            self.game_on = done(self.end_message)
    #________________________________________________________________________________________________________________________________



    def alternate(self,user_input):
        """
        to play a  game with alternate rule
        
        
        Parameters
        ----------
        user_input : str
            The user's input.


        Returns
        -------
        none

        """
        user_input_list=user_input.split()

        command_list = [None,None,None]
        commands = []
        max_commands = len(command_list)

        for n in range(len(user_input_list)):
            command = user_input_list[n]
            if n<max_commands:
                command_list[n]=user_input_list[n].strip()
            if user_input_list[n] != None:
                a_file = user_input_list[n][len(user_input_list[n])-4:]== ".txt"
            if not a_file:
                command = user_input_list[n].lower()
            commands.append(command)

        print("Executing:",commands)

        # COMMANDIngs
        command1=command_list[0]
        command2=command_list[1]
        command3=command_list[2]

        all_commands = ["load","board","cheat","comment","reset","discard","save","done","move"]

        try:
            if command1 == None or command1.lower() not in all_commands:
                raise CommandError(command1)

        except CommandError as bad_command:
            print(bad_command)

        # DONE
        if command1.lower() == "board":
            try:
                if self.game == None:
                    raise GameError(command1.lower())
                else:
                    filled = True
                    for deck_related_object in self.Decks:
                        if deck_related_object == None:
                            filled = False

                    if filled:
                        board(self.Stock,self.Discard,self.SUITS,self.PILES)
                    else:
                        print("No Cards")
            except GameError as gerror:
                print(gerror)

        # DONE
        elif command1.lower() == "cheat":

            #same as board
            try:
                if self.game == None:
                    raise GameError(command1.lower())
                else:
                    filled = True
                    for deck_related_object in self.Decks:
                        if deck_related_object == None:
                            filled = False

                    if filled:
                        cheat(self.Stock,self.Discard,self.SUITS,self.PILES)
                    else:
                        print("No Cards")
            except GameError as gerror:
                print(gerror)
                
        # DONE
        elif command1.lower() == "comment":
            comment_text(commands)
        
        # DONE
        elif command1.lower() == "load":
            start_filename = command2
            try:
                Decks = load(start_filename)
                self.SUITS = []
                self.PILES = []

                # update all decks
                try:
                    for deck_index in range(len(Decks)):
                        stock = Decks[deck_index].nameDeck()=="Stock"
                        discarded = Decks[deck_index].nameDeck()=="Discard"
                        pile = "pile" in Decks[deck_index].nameDeck().lower()
     
                        if stock:
                            self.Stock = Decks[deck_index]
                        elif discarded:
                            self.Discard = Decks[deck_index]
                        elif pile:
                            self.PILES.append(Decks[deck_index])
                        else:
                            self.SUITS.append(Decks[deck_index])

                    self.game = start_filename
                    self.SUITS.sort(key=by_name,reverse=True)
                    self.PILES.sort(key=by_name)
                    self.Decks = [self.Stock,self.Discard,self.SUITS,self.PILES]

                except Exception as anyerror:
                    raise FileError(command1)
                    
                

            except NotFoundError as nofile:
                print(nofile)

            except FileError as badfile:
                print(badfile)

            
        elif command1.lower() == "save":
            try:
                game_filename = command2.strip()
                save(game_filename,self.Decks) # can only save whatever game was initial loaded? NO

            except GameError as gerror:
                print(gerror)


        elif command1.lower() == "discard":
            try:
                if self.game==None:
                    raise GameError(command1.lower())
                else:
                    try:
                        if self.Stock.isemptyDeck():
                            raise DiscardError(command1)
                        else:
                            discard(self.Stock,self.Discard)
                    except DiscardError as OutOfStock:
                        print(OutOfStock)

            except GameError as gerror:
                print(gerror)

        elif command1.lower() == "move":
            try:
                if self.game==None:
                    raise GameError(command1.lower())
                else:
                    FromDeck = None
                    ToDeck = None
                    reds = ["Diamonds","Hearts"]
                    blacks = ["Clubs","Spades"]

                    Pile_numbers = ["1","2","3","4","5","6","7"]
                    options = ["stock","suit"] + Pile_numbers
                

                    try:
                        if  command2!=None and command2.lower() not in options  or command3!=None and command3.lower() not in options:
                            raise ArgumentError(command1)

                        elif command2 == None or command3 == None:
                            raise InsufficientArgumentError(command1)
                        else:
                            stock = command2.lower() == options[0]
                            suit = command3.lower() == options[1]
                            frompile = command2.lower() in Pile_numbers 
                            topile = command3.lower() in Pile_numbers
                            pile_to_pile = frompile and topile
                            
                            # STOCK TO SUIT, didnt change with alt rule
                            if stock and suit:
                                try:
                                    Suit = self.Stock.peekDeck().suitCard()
                                    if Suit == "Spades":
                                        SuitDeck = self.SUITS[0]
                                    elif Suit == "Hearts":
                                        SuitDeck = self.SUITS[1]
                                    elif Suit == "Diamonds":
                                        SuitDeck = self.SUITS[2]
                                    elif Suit == "Clubs":
                                        SuitDeck = self.SUITS[3]

                                    
                                except Exception:
                                    print("Stock Empty")

                                FromDeck = self.Stock
                                ToDeck = SuitDeck
                                

                            # STOCK TO PILE NUMBER, ALT CHANGED
                            elif stock and topile:
                                # STOCK MUST NOT BE EMPTY, 1 card at a time
                                StockSuit = self.Stock.peekDeck().suitCard() # alt

                                for pile in self.PILES:
                                    if command3 in pile.nameDeck():
                                        Pile = pile

                                PileSuit = Pile.peekDeck().suitCard()

                                try:
                                    if (StockSuit in reds and PileSuit in reds) or (StockSuit in blacks and PileSuit in blacks):
                                        raise MoveError(command1)
                                    else:
                                        FromDeck = self.Stock
                                        ToDeck = Pile
                                except MoveError as mustmix:
                                    raise MoveError(command1)


                            # PILE NUMBER TO SUIT, not affected by alt
                            elif frompile and suit:
                                # from Pile MUST NOT BE EMPTY
                                for pile in self.PILES:
                                    if command2 in pile.nameDeck():
                                        Pile = pile

                                try:
                                    Suit = Pile.peekDeck().suitCard()
                                    if Suit == "Spades":
                                        SuitDeck = self.SUITS[0]
                                    elif Suit == "Hearts":
                                        SuitDeck = self.SUITS[1]
                                    elif Suit == "Diamonds":
                                        SuitDeck = self.SUITS[2]
                                    elif Suit == "Clubs":
                                        SuitDeck = self.SUITS[3]
                                except Exception:
                                    raise MoveError(command1)
                                
                                FromDeck = Pile
                                ToDeck = SuitDeck

                            # PILE NUMBER TO PILE NUMBER, CHANGED BY ALT(relay comes in handy here:))
                            elif pile_to_pile:
                                # from Pile MUST NOT BE EMPTY,ANY LENGTH AT A TIME(relaytime), also need to compare hiddens!

                                relay = Deck("relayDeck")
                                hidden = "??"
                                Pile1Suit = None
                                Pile2Suit = None

                                for pile in self.PILES:
                                    if command2 in pile.nameDeck():
                                        Pile1 = pile
                                    if command3 in pile.nameDeck():
                                        Pile2 = pile


                                try:
                                    Pile2Suit = Pile2.peekDeck().suitCard() # strictly for alternating
                                    max_rank = Pile2.peekDeck().rankCard() # used for when moving multiple cards
                                    for count in range(Pile1.sizeDeck()): # temporary relay top chech bottom of from pile, only add non hiddens
                                        if str(Pile1.peekDeck()) != hidden and Pile1.peekDeck().rankCard() < max_rank:
                                            relay.pushDeck(Pile1.popDeck())
                                        # print(relay)

                                except Exception: # the second/ to deck/pile is allowed to be empty[FOR THE KINBG]
                                    for count in range(Pile1.sizeDeck()): # temporary relay top chech bottom of from pile, only add non hiddens
                                        if str(Pile1.peekDeck()) != hidden:
                                            relay.pushDeck(Pile1.popDeck())
                                

                                # just in case there are no cards in the from Deck
                                try:
                                    if relay.isemptyDeck(): 
                                        raise MoveError(command1)
                                    else:
                                        Pile1Suit = relay.peekDeck().suitCard()
                                        
                                except MoveError as emptypile1:
                                    raise MoveError(command1)

                                
                                    
                                    

                                # remember to add all those elemts in relay back to Pile1
                                for count in range(relay.sizeDeck()):
                                    Pile1.pushDeck(relay.popDeck())

                                try:
                                    if (Pile1Suit in reds and Pile2Suit in reds) or (Pile1Suit in blacks and Pile2Suit in blacks):
                                        raise MoveError(command1)
                                        print("alt colours")
                                    else:
                                        FromDeck = Pile1
                                        ToDeck = Pile2

                                except MoveError as mustmix:
                                    raise MoveError(command1)
                                

                            else:
                                print("no match")


                    except InsufficientArgumentError as need_args:
                        print(need_args)

                    except ArgumentError as bad_argument:
                        print(bad_argument)

                    except MoveError as mustmix:
                        print(mustmix)

                    else:
                        try:
                            move(FromDeck,ToDeck)

                        except MoveError as bad_move:
                            print(bad_move)

                        except AssertionError as ae:
                            print(ae)
                            
                            
                    
            except GameError as gerror:
                print(gerror)

        # DONE
        elif command1.lower() == "reset":
            try:
                if self.game == None:
                    raise GameError(command1.lower())
                else:
                    try:
                        if not self.Stock.isemptyDeck():
                            raise ResetError(command1)
                        else:
                            reset(self.Stock,self.Discard)
                    except ResetError as NoReset:
                        print(NoReset)
            except GameError as gerror:
                print(gerror)
        
        # DONE
        elif command1.lower() == "done":
            self.game_on = done(self.end_message)
    #________________________________________________________________________________________________________________________________

    

    def play(self,alternate_rule):
        """
        to play a Klondike game
        
        
        Parameters
        ----------
        alternate_rule : boolean
            determines which type of game will be played(alternate rule or no alternate rule).


        Returns
        -------
        none

        """
        assert type(alternate_rule) == bool, "%s is not a boolean"%alternate_rule

        print(self.start_message)
        if alternate_rule:
            while self.game_on:
                user_input = input("Your Move: ")
                self.alternate(user_input)
        else:
            while self.game_on:
                user_input = input("Your Move: ")
                self.regular(user_input)
#####################################################################################################################################

# Exception classes
class InsufficientArgumentError(Exception):
    def __init__(self,command):
        self.arg = "%s: incorrect number of arguments" % command
        super().__init__(self.arg)

class ArgumentError(Exception):
    def __init__(self,command):
        self.arg = "%s: arguments incorrect" % command
        super().__init__(self.arg)

class MoveError(Exception):
    def __init__(self,command):
        self.error_message = "%s: illegal move" % command
        super().__init__(self.error_message)

class CommandError(Exception):
    def __init__(self,command):
        self.error_message = "%s: illegal command" % command
        super().__init__(self.error_message)

class NotFoundError(Exception):
    def __init__(self,command):
        self.error_message = "%s: could not open file" % command
        super().__init__(self.error_message)

class FileError(Exception):
    def __init__(self,command):
        self.error_message = "%s: format error in file" % command
        super().__init__(self.error_message)

class GameError(Exception):
    def __init__(self,command):
        self.error_message = "%s: must load game" % command
        super().__init__(self.error_message)

class DiscardError(Exception):
    def __init__(self,command):
        self.error_message = "%s: Cannot Discard. Stock is empty" % command
        super().__init__(self.error_message)

class ResetError(Exception):
    def __init__(self,command):
        self.error_message = "%s: Cannot Reset. Stock is not empty" % command
        super().__init__(self.error_message)

class SaveError(MoveError):
    def __init__(self):
        super().__init__(self.error_message)
#####################################################################################################################################

# COMMANDS
def comment_text(commands):
    """
    to comment
    
    Parameters
    ----------
    command : list
        A list of strings; commands for commenting.


    Returns
    -------
    none

    """
    comment = "%s:"% commands.pop(0).capitalize()
    for add_comment in commands:
        comment+=" "+add_comment
    print(comment)
#________________________________________________________________________________________________________________________________


def reset(Stock, Discard):
    """
    to transfer all cards from discard to stock
    
    Parameters
    ----------
    Stock : Deck
        stock deck.
    Discard : Deck
        discard deck.


    Returns
    -------
    none

    """
    # ADD BACK TO STOCK IN THE ORDER FROM WHICH THEY CAME, FOFI

    assert Stock.sizeDeck() == 0, "Stock Not Empty"

    relay = Deck("relay_deck")
    last_card_count = Discard.sizeDeck()-1

    for card_count in range(Discard.sizeDeck()):
        relay.pushDeck(Discard.popDeck())

 
    for card_count in range(relay.sizeDeck()):
        if card_count == last_card_count:
            relay.peekDeck().faceupCard(True)
        Stock.pushDeck(relay.popDeck())
#________________________________________________________________________________________________________________________________


def discard(Stock, Discard):
    """
    to transfer ((3max) cards from stock to discard
    
    Parameters
    ----------
    Stock : Deck
        stock deck.
    Discard : Deck
        discard deck.


    Returns
    -------
    none

    """
    # 3 or less, Stock to discard
    assert Stock.sizeDeck()>0, "Stock Empty"

    relay = Deck("relay_deck")
    max = 3
    if Stock.sizeDeck()>=max:
        moves = max
        for n in range(moves):
            Stock.peekDeck().faceupCard(False)
            relay.pushDeck(Stock.popDeck())
            Discard.pushDeck(relay.popDeck())

    else:
        moves = Stock.sizeDeck()
        for n in range(moves):
            Stock.peekDeck().faceupCard(False)
            relay.pushDeck(Stock.popDeck())
            Discard.pushDeck(relay.popDeck())

    if not Stock.isemptyDeck():
        Stock.peekDeck().faceupCard(True)
#________________________________________________________________________________________________________________________________


def board(Stock, Discard, Suits, Piles):
    """
    to display table to player to see updates from gameplay
    
    Parameters
    ----------
    Stock : Deck
        stock deck.
    Discard : Deck
        discard deck.
    Suits : list
        list of suit decks.
    Piles : list
        lsit of pile decks.


    Returns
    -------
    none

    """
    line1 = "%8s"%Stock.nameDeck()+str(Stock)
    line2 = "%8s"%Discard.nameDeck()+str(Discard)
    line3 = "%8s"%Suits[0].nameDeck()+str(Suits[0])
    line4 = "%8s"%Suits[1].nameDeck()+str(Suits[1])
    line5 = "%8s"%Suits[2].nameDeck()+str(Suits[2])
    line6 = "%8s"%Suits[3].nameDeck()+str(Suits[3])
    line7 = "%8s"%Piles[0].nameDeck()+str(Piles[0])
    line8 = "%8s"%Piles[1].nameDeck()+str(Piles[1])
    line9 = "%8s"%Piles[2].nameDeck()+str(Piles[2])
    line10 = "%8s"%Piles[3].nameDeck()+str(Piles[3])
    line11 = "%8s"%Piles[4].nameDeck()+str(Piles[4])
    line12 = "%8s"%Piles[5].nameDeck()+str(Piles[5])
    line13 = "%8s"%Piles[6].nameDeck()+str(Piles[6])

    print(line1,line2,line3,line4, line5, line6, line7, line8, line9, line10, line11, line12, line13, sep="\n")
#________________________________________________________________________________________________________________________________


def cheat(Stock, Discard, Suits, Piles):
    """
    to display table to player to see updates from gameplay, player will see all cards despite them having a hidden state
    
    Parameters
    ----------
    Stock : Deck
        stock deck.
    Discard : Deck
        discard deck.
    Suits : list
        list of suit decks.
    Piles : list
        lsit of pile decks.


    Returns
    -------
    none

    """
    line1 = "%8s"%Stock.nameDeck()+repr(Stock)
    line2 = "%8s"%Discard.nameDeck()+repr(Discard)
    line3 = "%8s"%Suits[0].nameDeck()+repr(Suits[0])
    line4 = "%8s"%Suits[1].nameDeck()+repr(Suits[1])
    line5 = "%8s"%Suits[2].nameDeck()+repr(Suits[2])
    line6 = "%8s"%Suits[3].nameDeck()+repr(Suits[3])
    line7 = "%8s"%Piles[0].nameDeck()+repr(Piles[0])
    line8 = "%8s"%Piles[1].nameDeck()+repr(Piles[1])
    line9 = "%8s"%Piles[2].nameDeck()+repr(Piles[2])
    line10 = "%8s"%Piles[3].nameDeck()+repr(Piles[3])
    line11 = "%8s"%Piles[4].nameDeck()+repr(Piles[4])
    line12 = "%8s"%Piles[5].nameDeck()+repr(Piles[5])
    line13 = "%8s"%Piles[6].nameDeck()+repr(Piles[6])

    print(line1, line2, line3, line4, line5, line6, line7, line8, line9, line10, line11, line12, line13, sep="\n")
#________________________________________________________________________________________________________________________________


def done(message):
    """
    end game
    
    Parameters
    ----------
    message : str
        message to be displayed


    Returns
    -------
    game_state : boolean
        The new game state. Will be false so game ends

    """
    game_state = False
    print(message)
    return game_state
#________________________________________________________________________________________________________________________________


def load(filename):
    """
    end game
    
    Parameters
    ----------
    filename : str
        gamefilename to load a starting game_state


    Returns
    -------
    Decks : list
        list of all decks determined by starting state from file

    """
    command_name = "load"
    filemode = "r"
    Decks = []

    try:
        gamefile = open(filename,filemode)
    # accepted as built in "FileNotFoundError" and redirected as user drfined NotFRound error

    except Exception as nofile: # for all bad file names/ lack of name given
        raise NotFoundError(command_name)
    
    try:
        lines = gamefile.readlines()
        for line in lines:
            clean_line = []
            line = line.strip("\n").split()
            for string in line:
                if string not in ["[","]"]:
                    clean_line.append(string)

            A_Deck = Deck(clean_line.pop(0))
            Decks.append(A_Deck)
            relay = Deck("relayDeck")

            if len(clean_line)!=0:
                for card_string in clean_line:
                    card_rank = card_string[0]
                    card_suit = card_string[1]
                    card_state = card_string[2]

                    card = Card(card_suit,card_rank)
                    down = "-"
                    if card_state == down:
                        card.faceupCard(False)

                    relay.pushDeck(card)

                for count in range(relay.sizeDeck()):
                    A_Deck.pushDeck(relay.popDeck())

    except Exception as badfile:
        raise FileError(command_name)

    gamefile.close() # don't forget to close
    return Decks 
#________________________________________________________________________________________________________________________________
    

def save(game_filename,Decks):
    """
    save current game state
    
    Parameters
    ----------
    filename : str
        gamefilename to load a starting game_state
    Decks : list
        lsit of objects used in game in their current state. Used to save game state


    Returns
    -------
    None

    """
    command_type = "save"
    filemode = "w"
    try:
        gamefile = open(game_filename,filemode)

    except:
        NotFoundError(command_type)

    line = ""
    new = "\n"
    total_decks = 13

    for item in Decks:
        if type(item)==Deck:
            line = item.nameDeck()+repr(item)+new
            gamefile.write(line)
        elif type(item)==list:
            for index in range(len(item)):
                a_Deck = item[index]
                line = a_Deck.nameDeck()+repr(a_Deck)+new
                gamefile.write(line)

    gamefile.close()
#________________________________________________________________________________________________________________________________


def move(fromDeck, toDeck):
    """
    move card(s) from one deck to another
    
    Parameters
    ----------
    fromDeck : Deck
        card is removed from this deck
    toDeck : Deck
        card is added from this deck


    Returns
    -------
    None

    """
    
    assert type(fromDeck)==Deck, "%s is not a Deck"%(fromDeck)
    assert type(toDeck)==Deck, "%s is not a Deck"%(toDeck)

    command_name = "move"

    if type(fromDeck)==None or type(toDeck)==None:
        raise InsufficientArgumentError(command_name)


    relay = Deck("relayDeck") # for pile to pile
    Stock = "Stock"
    SUITS = ["Spades","Hearts","Diamonds","Clubs"]
    PILES = [1,2,3,4,5,6,7]
    

    # STOCK TO SUIT
    if fromDeck.nameDeck() == Stock and toDeck.nameDeck() in SUITS:
        # STOCK MUST NOT BE EMPTY, 1 card at a time, must be a then 2 then 3
        can_move = False
        Ace = False
        AceRank = 1

        if not fromDeck.isemptyDeck():
            rankStockTop = fromDeck.peekDeck().rankCard()

            # if the toDeck is empty then this will throw, can still continue with program though
            if not toDeck.isemptyDeck():
                rankSuitTop = toDeck.peekDeck().rankCard()
                can_move = rankStockTop==rankSuitTop+1

            isAce = fromDeck.peekDeck().rankCard() == AceRank
            Ace = isAce and toDeck.isemptyDeck()
        
            if Ace or can_move:
                card = fromDeck.popDeck()
                card.faceupCard(True)
                
                toDeck.pushDeck(card)

                # flip the next top card on the from Deck
                if not fromDeck.isemptyDeck():
                    fromDeck.peekDeck().faceupCard(True)
            else:
                raise MoveError(command_name)

        else: 
            raise MoveError(command_name)
            


    # STOCK TO PILE NUMBER
    elif fromDeck.nameDeck() == Stock and int(toDeck.nameDeck()[len(toDeck.nameDeck())-1]) in PILES:
        # STOCK MUST NOT BE EMPTY, 1 card at a time
        can_move = False
        Kings_Throne = False
        KingRank = 13 # had trouble with converting from inital rank "K" to actual rank 13

        if not fromDeck.isemptyDeck():
            rankStockTop = fromDeck.peekDeck().rankCard()

            if not toDeck.isemptyDeck():
                rankPileTop = toDeck.peekDeck().rankCard()
                can_move = rankPileTop==rankStockTop+1

            Kings_Throne = fromDeck.peekDeck().rankCard() == KingRank and toDeck.isemptyDeck()
        

            if Kings_Throne or can_move:
                card = fromDeck.popDeck()
                card.faceupCard(True)

                toDeck.pushDeck(card)

                # flip the next top card on the from Deck
                if not fromDeck.isemptyDeck():
                    fromDeck.peekDeck().faceupCard(True)
            else:
                raise MoveError(command_name)

        else:
            raise MoveError(command_name)



    # PILE NUMBER TO SUIT
    elif int(fromDeck.nameDeck()[len(fromDeck.nameDeck())-1]) in PILES and toDeck.nameDeck() in SUITS:
        # from Pile MUST NOT BE EMPTY
        can_move = False
        Ace = False

        if not fromDeck.isemptyDeck():
            rankPileTop = fromDeck.peekDeck().rankCard()

            if not toDeck.isemptyDeck():
                rankSuitTop = toDeck.peekDeck().rankCard()
                can_move = rankPileTop==rankSuitTop+1

            Ace = fromDeck.peekDeck().rankCard() == 1 and toDeck.isemptyDeck()


            if Ace or can_move:
                card = fromDeck.popDeck()
                card.faceupCard(True)

                toDeck.pushDeck(card)

                # flip the next top card on the from Deck
                if not fromDeck.isemptyDeck():
                    fromDeck.peekDeck().faceupCard(True)
            else:
                raise MoveError(command_name)

        else:
            raise MoveError(command_name)
            

    # PILE NUMBER TO PILE NUMBER
    elif int(fromDeck.nameDeck()[len(fromDeck.nameDeck())-1]) in PILES:
         # from Pile MUST NOT BE EMPTY,ANY LENGTH AT A TIME(relaytime),
         if not fromDeck.isemptyDeck():
            hidden = "??"
            legal = False
            Kings_Throne = False
            KingRank = 13 # had trouble with converting from inital rank "K" to actual rank 13

            for card_count in range(fromDeck.sizeDeck()): 
                if str(fromDeck.peekDeck()) != hidden:
                    relay.pushDeck(fromDeck.popDeck())
                    
            
            # print(relay)
            isKing = relay.peekDeck().rankCard() == KingRank
            # print(isKing)
            Kings_Throne = isKing and toDeck.isemptyDeck()

            if not toDeck.isemptyDeck():
                rankToPileTop = toDeck.peekDeck().rankCard()
                
                card_count = relay.sizeDeck()
                while not legal and card_count>0:
                    rankFromPileTop = relay.peekDeck().rankCard()
                    legal = rankFromPileTop+1==rankToPileTop
                    if not legal:
                        fromDeck.pushDeck(relay.popDeck())
                        card_count-=1


            if Kings_Throne or legal:
                for card_count in range(relay.sizeDeck()):
                    toDeck.pushDeck(relay.popDeck())
                
                # flip the next top card on the from Deck
                if not fromDeck.isemptyDeck():
                    fromDeck.peekDeck().faceupCard(True)

            else:
                for count in range(relay.sizeDeck()):
                    fromDeck.pushDeck(relay.popDeck())
                
                raise MoveError(command_name)
            
         else:
             raise MoveError(command_name)

# solely for sorting decks in lists
def by_name(Deck):
    """
    adding a key to sort a list of decks
    
    Parameters
    ----------
    Deck: Deck
        Object type for this key is Deck.


    Returns
    -------
    the deck's name for sorting

    """
    return Deck.nameDeck()
#________________________________________________________________________________________________________________________________
#####################################################################################################################################


main()