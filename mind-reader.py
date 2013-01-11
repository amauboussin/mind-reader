
from string import count
from random import random

max_buffer_size = 8
win_threshold = 50

def main():
	
	print """Enter 0 or 1 repeatedly. The computer will try to guess what you will input next based off your previous responses.
If you the computer guesses correctly, it gets a point. If if guesses incorrectly you get a point. First to %s wins.
To maximize your chances of winning try to avoid falling into any patterns. 
	""" % win_threshold
	
	computer_wins = 0
	player_wins = 0
	
	history = ''
	while (True):
		
		guess = getch()

		prediction = get_prediction(history)
		
		if  prediction == int(guess):
			computer_wins += 1
		else:
			player_wins += 1
			
		history += str(guess)
		
		print "Computer: "+'='*computer_wins
		print "  Player: "+'='*player_wins
		
		if computer_wins >= win_threshold:
			print "Computer wins %s to %s!" % (computer_wins,player_wins)
			break
		if player_wins >= win_threshold:
			print "You win %s to %s!" % (player_wins, computer_wins)
			break
		
def get_prediction(history):
	votes_0 = 0
	votes_1 = 0		
	#scan the history for patterns up to max_buffer_size and compiles votes
	for n in range(max_buffer_size):
		
		#get the last n characters that occurred
		if n == 0:
			last_n = ''
		else:
			last_n = history[-n:]
		
		
		#check if the pattern ends with 1 or 0 more often in the history
		zero = history.count(last_n+'0')
		one = history.count(last_n+'1')

		if zero > one:
			votes_0 += get_votes(n)
		elif one > zero:
			votes_1 += get_votes(n)
	
	if votes_0 > votes_1:
		prediction = 0
		
	elif votes_1 > votes_0:
		prediction = 1
	
	# pick randomly if tied
	else:
		if random() > .5: prediction = 0
		else: prediction = 1
		
	return prediction

#determines how many votes  a pattern of length n is worth
def get_votes(n):
	e = 2.71828
	n = float(n)
	power = -(  ((n-4.0)**2.0) / (2.0*2.0**2.0) )
	return e**power
	
# start get character recipe from http://code.activestate.com/recipes/577977-get-single-keypress/history/1/
import sys

try:
    import tty, termios
except ImportError:
    # Probably Windows.
    try:
        import msvcrt
    except ImportError:
        # FIXME what to do on other platforms?
        # Just give up here.
        raise ImportError('getch not available')
    else:
        getch = msvcrt.getch
else:
    def getch():
        """getch() -> key character

        Read a single keypress from stdin and return the resulting character. 
        Nothing is echoed to the console. This call will block if a keypress 
        is not already available, but will not wait for Enter to be pressed. 

        If the pressed key was a modifier key, nothing will be detected; if
        it were a special function key, it may return the first character of
        of an escape sequence, leaving additional characters in the buffer.
        """
        fd = sys.stdin.fileno()
        old_settings = termios.tcgetattr(fd)
        try:
            tty.setraw(fd)
            ch = sys.stdin.read(1)
        finally:
            termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)
        return ch
main()